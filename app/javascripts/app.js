// Import the page's CSS. Webpack will know what to do with it.
import "../stylesheets/app.css"

// Import libraries we need.
import { default as Web3 } from 'web3'
import { default as contract } from 'truffle-contract'
import { default as CryptoJS } from 'crypto-js'

// The following code is simple to show off interacting with your contracts.
// As your needs grow you will likely need to change its form and structure.
// For application bootstrapping, check out window.addEventListener below.
var accounts
var account
var smartCarContract
// var smartCarContract ABI
var ABI
// next number
var nextNumber = -1
var globalTrailCount = 0

window.App = {
    start: function () {
        var self = this

        // get default accounts and other accounts available from metamask
        // default address is used for sendtransacion, 
        web3.eth.getAccounts(function (err, accs) {

            if (err != null) {
                alert("there was a creepy error while fetching accounts.")
                return
            }

            if (accs.length == 0) {
                alert("Couldn't get any accounts. Please make sure your Ethereum client is configured correctly.");
                return;
            }

            accounts = accs
            account = accounts[0] // get default account 
            web3.eth.defaultAccount = account

        });

        ABI = [
            {
                "constant": false,
                "inputs": [
                    {
                        "name": "trailCount",
                        "type": "uint8"
                    }
                ],
                "name": "getDetailsForTrailCount",
                "outputs": [
                    {
                        "name": "",
                        "type": "address"
                    },
                    {
                        "name": "",
                        "type": "string"
                    },
                    {
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [
                    {
                        "name": "trailNo",
                        "type": "uint8"
                    },
                    {
                        "name": "user_address",
                        "type": "address"
                    }
                ],
                "name": "getPrevAndNext",
                "outputs": [
                    {
                        "name": "",
                        "type": "string"
                    },
                    {
                        "name": "",
                        "type": "string"
                    },
                    {
                        "name": "",
                        "type": "uint256"
                    },
                    {
                        "name": "",
                        "type": "string"
                    }
                ],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [
                    {
                        "name": "trailNo",
                        "type": "uint8"
                    }
                ],
                "name": "getCarInfo",
                "outputs": [
                    {
                        "name": "",
                        "type": "string"
                    },
                    {
                        "name": "",
                        "type": "string"
                    },
                    {
                        "name": "",
                        "type": "uint256"
                    },
                    {
                        "name": "",
                        "type": "string"
                    }
                ],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [
                    {
                        "name": "_ownerName",
                        "type": "string"
                    },
                    {
                        "name": "_ownerId",
                        "type": "address"
                    },
                    {
                        "name": "_carDesc",
                        "type": "string"
                    },
                    {
                        "name": "_secret",
                        "type": "string"
                    }
                ],
                "name": "addCarInfo",
                "outputs": [],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [],
                "name": "getTrailCount",
                "outputs": [
                    {
                        "name": "",
                        "type": "uint8"
                    }
                ],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [],
                "payable": true,
                "stateMutability": "payable",
                "type": "constructor"
            }
        ]

        smartCarContract = web3.eth.contract(ABI);

    },
    createNewInstance: function () {
        console.log("Create new Instance")
        smartCarContract.new(
            {
              from: web3.eth.accounts[0], 
              data: '0x60806040526000600160006101000a81548160ff021916908360ff160217905550610f8a8061002f6000396000f30060806040526004361061006d576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff168063010c0119146100725780632117f6ca1461015557806335a75805146102fd57806363d1e8931461048557806373f0101c1461059a575b600080fd5b34801561007e57600080fd5b506100a0600480360381019080803560ff1690602001909291905050506105cb565b604051808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200180602001838152602001828103825284818151815260200191508051906020019080838360005b838110156101185780820151818401526020810190506100fd565b50505050905090810190601f1680156101455780820380516001836020036101000a031916815260200191505b5094505050505060405180910390f35b34801561016157600080fd5b506101a3600480360381019080803560ff169060200190929190803573ffffffffffffffffffffffffffffffffffffffff1690602001909291905050506106e4565b60405180806020018060200185815260200180602001848103845288818151815260200191508051906020019080838360005b838110156101f15780820151818401526020810190506101d6565b50505050905090810190601f16801561021e5780820380516001836020036101000a031916815260200191505b50848103835287818151815260200191508051906020019080838360005b8381101561025757808201518184015260208101905061023c565b50505050905090810190601f1680156102845780820380516001836020036101000a031916815260200191505b50848103825285818151815260200191508051906020019080838360005b838110156102bd5780820151818401526020810190506102a2565b50505050905090810190601f1680156102ea5780820380516001836020036101000a031916815260200191505b5097505050505050505060405180910390f35b34801561030957600080fd5b5061032b600480360381019080803560ff1690602001909291905050506109a3565b60405180806020018060200185815260200180602001848103845288818151815260200191508051906020019080838360005b8381101561037957808201518184015260208101905061035e565b50505050905090810190601f1680156103a65780820380516001836020036101000a031916815260200191505b50848103835287818151815260200191508051906020019080838360005b838110156103df5780820151818401526020810190506103c4565b50505050905090810190601f16801561040c5780820380516001836020036101000a031916815260200191505b50848103825285818151815260200191508051906020019080838360005b8381101561044557808201518184015260208101905061042a565b50505050905090810190601f1680156104725780820380516001836020036101000a031916815260200191505b5097505050505050505060405180910390f35b34801561049157600080fd5b50610598600480360381019080803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509192919290803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509192919290803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509192919290505050610bee565b005b3480156105a657600080fd5b506105af610e3f565b604051808260ff1660ff16815260200191505060405180910390f35b6000606060008060008560ff16815260200190815260200160002060010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff166000808660ff1681526020019081526020016000206003016000808760ff16815260200190815260200160002060040154818054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156106d05780601f106106a5576101008083540402835291602001916106d0565b820191906000526020600020905b8154815290600101906020018083116106b357829003601f168201915b505050505091509250925092509193909250565b606080600060608473ffffffffffffffffffffffffffffffffffffffff166000808860ff16815260200190815260200160002060010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1614151561075d57600080fd5b6000808760ff1681526020019081526020016000206000016000808860ff1681526020019081526020016000206003016000808960ff168152602001908152602001600020600401546000808a60ff168152602001908152602001600020600501838054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156108535780601f1061082857610100808354040283529160200191610853565b820191906000526020600020905b81548152906001019060200180831161083657829003601f168201915b50505050509350828054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156108ef5780601f106108c4576101008083540402835291602001916108ef565b820191906000526020600020905b8154815290600101906020018083116108d257829003601f168201915b50505050509250808054600181600116156101000203166002900480601f01602080910402602001604051908101604052809291908181526020018280546001816001161561010002031660029004801561098b5780601f106109605761010080835404028352916020019161098b565b820191906000526020600020905b81548152906001019060200180831161096e57829003601f168201915b50505050509050935093509350935092959194509250565b606080600060606000808660ff1681526020019081526020016000206000016000808760ff1681526020019081526020016000206003016000808860ff168152602001908152602001600020600401546000808960ff168152602001908152602001600020600501838054600181600116156101000203166002900480601f016020809104026020016040519081016040528092919081815260200182805460018160011615610100020316600290048015610aa05780601f10610a7557610100808354040283529160200191610aa0565b820191906000526020600020905b815481529060010190602001808311610a8357829003601f168201915b50505050509350828054600181600116156101000203166002900480601f016020809104026020016040519081016040528092919081815260200182805460018160011615610100020316600290048015610b3c5780601f10610b1157610100808354040283529160200191610b3c565b820191906000526020600020905b815481529060010190602001808311610b1f57829003601f168201915b50505050509250808054600181600116156101000203166002900480601f016020809104026020016040519081016040528092919081815260200182805460018160011615610100020316600290048015610bd85780601f10610bad57610100808354040283529160200191610bd8565b820191906000526020600020905b815481529060010190602001808311610bbb57829003601f168201915b5050505050905093509350935093509193509193565b610bf6610e56565b84816000018190525083816020019073ffffffffffffffffffffffffffffffffffffffff16908173ffffffffffffffffffffffffffffffffffffffff1681525050828160600181905250818160a00181905250428160800181815250506000600160009054906101000a900460ff1660ff16141515610cef57600080600160009054906101000a900460ff1660ff16815260200190815260200160002060010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16816040019073ffffffffffffffffffffffffffffffffffffffff16908173ffffffffffffffffffffffffffffffffffffffff16815250505b80600080600160009054906101000a900460ff1660ff1681526020019081526020016000206000820151816000019080519060200190610d30929190610eb9565b5060208201518160010160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555060408201518160020160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055506060820151816003019080519060200190610ddb929190610eb9565b506080820151816004015560a0820151816005019080519060200190610e02929190610eb9565b509050506001600081819054906101000a900460ff168092919060010191906101000a81548160ff021916908360ff160217905550505050505050565b6000600160009054906101000a900460ff16905090565b60c06040519081016040528060608152602001600073ffffffffffffffffffffffffffffffffffffffff168152602001600073ffffffffffffffffffffffffffffffffffffffff1681526020016060815260200160008152602001606081525090565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f10610efa57805160ff1916838001178555610f28565b82800160010185558215610f28579182015b82811115610f27578251825591602001919060010190610f0c565b5b509050610f359190610f39565b5090565b610f5b91905b80821115610f57576000816000905550600101610f3f565b5090565b905600a165627a7a7230582033b472547a4e0b5e1e1e0dd18c5a02bc0c5776ce537c91c1233d3792137002ea0029',
              gas: '4700000'
            }, function (e, contract){
             console.log(e, contract);
             if (typeof contract.address !== 'undefined') {
                //smartCarCode = contract
                var contractAddress = contract.address
                console.log('Contract mined! address: ' + contractAddress + ' transactionHash: ' + contract.transactionHash);
                document.getElementById('contractAddress').value = contractAddress
                const status = document.getElementById('status')
                status.style.color = "green";
                status.innerHTML = "successfully deployed !!!"
             }
          })
    },
    addNewCar : function () {
        console.log("Add new car info")

        var smartcarAddress = document.getElementById("carAddress").value
        var ownerName = document.getElementById("ownerName").value
        var ownerId = document.getElementById("ownerId").value  
        var carDescription = document.getElementById("carDescription").value
        var passPhraseForEncryption = document.getElementById("passphrase").value
        var carSecret = document.getElementById("secret").value
        console.log("values ---> "+ownerName+" "+ownerId+" "+carDescription+" "+passPhraseForEncryption+" "+carSecret)

        //connect to car contract using car contract address
        var smartCarCode = smartCarContract.at(smartcarAddress);

        //encrypt the car secret
        var encryptedSecret = CryptoJS.AES.encrypt(carSecret, passPhraseForEncryption).toString()
        smartCarCode.addCarInfo(ownerName, ownerId, carDescription, encryptedSecret, function(error){
            
            const status = document.getElementById('statusCarDetails')
            if(error !== null) {
                status.style.color = "red";
                status.innerHTML = "Error in adding new record"
            }else {
                status.style.color = "green";
                status.innerHTML = "successfully add the information !!!"
            }
            
        })
    },
    readCarDetail : function() {
        console.log("Read Car Details")

        var smartcarAddress = document.getElementById("carAddressRead").value
        var phassphrase = document.getElementById("passphraseRead").value
        //connect to car contract using car contract address
        var smartCarCode = smartCarContract.at(smartcarAddress)

        //get the current trail count
        smartCarCode.getTrailCount.call(function (err, trailCount) {

            const status = document.getElementById('readStatusCarDetails')
            if(err !== null) {
                status.style.color = "red";
                status.innerHTML = "Error in getting trailer count"
                console.log("error ")
            }else {
                status.innerHTML = "successfully read triler count !!!"
                
                //setup conditions for prev and next buttons readMyHistory functions
                nextNumber = (trailCount -1)
                globalTrailCount = (trailCount -1)
                if (trailCount>0) {
                    console.log("TrailCount ---> "+trailCount)
                    document.getElementById("backBtnReadInfo").disabled = false;
                    document.getElementById("nextBtnReadInfo").disabled = true;

                    //get data using currentrailcount-1
                    smartCarCode.getCarInfo.call(trailCount-1, function (err, returnVals) {
                        
                        if (err !== null) {
                            status.style.color = "red";
                            status.innerHTML = "Error in getting car record"
                            console.log(err)
                        } else {

                            console.log(returnVals)
                            //set UI fields
                            var lblOwnerName = document.getElementById('readOwnerName')
                                lblOwnerName.innerHTML = returnVals[0]
                            var lblCarDesc = document.getElementById('readCarDesc')
                                lblCarDesc.innerHTML = returnVals[1]
                            var lblContractDate = document.getElementById('readContractDateTime')
                                lblContractDate.innerHTML = new Date(returnVals[2]*1000)
                            //decrypt
                            var secretEncrypted = returnVals[3];
                            var decryptSecret = CryptoJS.AES.decrypt(secretEncrypted, phassphrase).toString(CryptoJS.enc.Utf8)

                            var lblReadSecret = document.getElementById('readSecret')
                            lblReadSecret.innerHTML = decryptSecret
                            status.style.color = "green";
                            status.innerHTML = "successfully read  car info !!!"

                        }
                    })

                } 
                
                
            }

        })

    },
    readMyHistory: function (statusBtnClick) {

        console.log("")

        var smartcarAddress = document.getElementById("carAddressRead").value
        var phassphrase = document.getElementById("passphraseRead").value
        var smartcarOwnerAddress = document.getElementById("smartcarOwnerAddress").value
        var status = document.getElementById('readStatusCarDetails')

        //connect to car contract using car contract address
        var smartCarCode = smartCarContract.at(smartcarAddress)

        //validation for useraddress
        if (smartcarOwnerAddress.length == 42) {

            if (statusBtnClick == 1) { // Go backward
                nextNumber--
            } else { // Go forward
                nextNumber++
            }

            //get data using nextNumber
            smartCarCode.getPrevAndNext.call(nextNumber, smartcarOwnerAddress, function (err, returnVals) {

                console.log(nextNumber)
                if (err !== null) {
                    status.style.color = "red";
                    status.innerHTML = "You don't have further more history for this car."
                    console.log(err)

                    //this error happend becuase you can not read further more history of the current user
                    //so it should enble the next button and should disable the prev button
                    document.getElementById("nextBtnReadInfo").disabled = false;
                    document.getElementById("backBtnReadInfo").disabled = true;


                    //anything went wrong we resetting counters status back to previous
                    if (statusBtnClick == 1) { // Go backward
                        nextNumber += 1
                    } else { // Go forward
                        nextNumber -= 1
                    }
                } else {

                    console.log(returnVals)
                    //set UI fields
                    var lblOwnerName = document.getElementById('readOwnerName')
                    lblOwnerName.innerHTML = returnVals[0]
                    var lblCarDesc = document.getElementById('readCarDesc')
                    lblCarDesc.innerHTML = returnVals[1]
                    var lblContractDate = document.getElementById('readContractDateTime')
                    lblContractDate.innerHTML = new Date(returnVals[2] * 1000)
                    //decrypt
                    var secretEncrypted = returnVals[3];
                    var decryptSecret = CryptoJS.AES.decrypt(secretEncrypted, phassphrase).toString(CryptoJS.enc.Utf8)

                    var lblReadSecret = document.getElementById('readSecret')
                    lblReadSecret.innerHTML = decryptSecret
                    status.style.color = "green";
                    status.innerHTML = "successfully read  car info !!!"

                }
                console.log("Next Number ---> " + nextNumber)
                //dissable button according to the status
                if (globalTrailCount == nextNumber) {
                    document.getElementById("nextBtnReadInfo").disabled = true;
                    document.getElementById("backBtnReadInfo").disabled = false;
                } else if (nextNumber == 0) {
                    document.getElementById("nextBtnReadInfo").disabled = false;
                    document.getElementById("backBtnReadInfo").disabled = true;
                }
            })
        } else {
            status.style.color = "red";
            status.innerHTML = "please enter valid owner adress !!!"
        }

    },
    getCurrentTrailCount: function () {

        var smartcarAddress = document.getElementById("carAddressBuyPane").value
        var currentTrailBuyPane = document.getElementById("currentTrailBuyPane")
        var status = document.getElementById('readStatusBuyPane')

        //connect to car contract using car contract address
        var smartCarCode = smartCarContract.at(smartcarAddress)


        //get the current trail count
        smartCarCode.getTrailCount.call(function(err, trailCount){

            if (err !== null) {
                status.style.color = "red";
                status.innerHTML = "error in getting search range !!!"
            } else {

                currentTrailBuyPane.innerHTML = "You can search between 0 and "+(trailCount-1) + " Indexes"
                status.style.color = "green";
                status.innerHTML = "successfully got the search range for this car !!!"
            }

        })

    },
    readPage: function() {

        var pageNo = document.getElementById("pageNumber").value
        var status = document.getElementById('statusReadPageBuyPane')
        var smartcarAddress = document.getElementById("carAddressBuyPane").value
        var readPageResult = document.getElementById("readPageResult")

        //connect to car contract using car contract address
        var smartCarCode = smartCarContract.at(smartcarAddress)

        //Promise : get Data for supplied TrailCount
        var promiseDataForTrailCount = function() {

            return new Promise(function(resolve, reject) {
                smartCarCode.getDetailsForTrailCount.call(pageNo, function(error, details) {
                    if(error !== null) {
                        status.style.color = "red";
                        status.innerHTML = "error in getting data for supplied Trail Count !!!"
                        reject(error)
                    } else {
                        status.style.color = "green";
                        status.innerHTML = "successfully received the data for supplied Trail Count !!!"
                        resolve(details)
                    }
                })
            })
        }

        //Promise : get current Block Number
        var promiseGetCurrentBlockNumber = function() {

            return new Promise(function(resolve, reject) {
                web3.eth.getBlockNumber(function(error, result) {
                    if(error !== null) {
                        status.style.color = "red";
                        status.innerHTML = "error in getting current Block Number !!!"
                        reject(error)
                    } else {
                        status.style.color = "green";
                        status.innerHTML = "successfully received the current Block Number !!!"
                        resolve(result)
                    }
                    
                })
            })

        }

        //Promise : get requested Block (use for getting latest block)
        var promiseGetRequestedBlock =  function(blockNumber){

            return new Promise(function(res, rej){
                web3.eth.getBlock(blockNumber, true, function (err, block) { res(block) })
            })
    
        } 


        //indecator to tract mathing is went well 
        var counter = 0;

        promiseDataForTrailCount().then(function(data){ //data is the retrieved block data related to supplied trail count
            
            promiseGetCurrentBlockNumber().then(function(result){
                console.log("latest block number "+ result)
                
                //loop from 1st Block to Current Block
                for(let a=0; a<result; a+=1) {
                    console.log("outer----------------")
                    promiseGetRequestedBlock(a).then(function(block){
                        
                        console.log("length - "+block.transactions.length)
                        console.log(block)
                        //loop through each an every transactions of a Block
                        for(let b=0; b<block.transactions.length; b+=1) {
    
                            console.log("To "+a+"---> "+block.transactions[b].to)
    
                            if ( block.transactions[b].from == account && block.transactions[b].to == data[0]) {
                                console.log("match found")
                                counter = 1 // because of match is found set counter to 1
                            }

                            if ((a) == (result - 1) && (b) == ((block.transactions.length) - 1)) {
                                console.log("end")
                            }

                            if (counter == 0 && (a) == (result - 1) && (b) == ((block.transactions.length) - 1)) {
                                // it simply mean now this is in the ending point but there are no matching records found 
                                // so have to pay
                                console.log("ready to pay")
                                web3.eth.sendTransaction({
                                    from: account, // from current account 
                                    to: data[0], // owner address
                                    gasLimit: 5000000,
                                    gasPrice: 4700000,
                                    value: 5000 //1.3$
                                }, function (err, res) {
                                    if (err !== null) {
                                        status.style.color = "red";
                                        status.innerHTML = "Error while you were paying !!!"
                                    } else {
        
                                        readPageResult.innerHTML += "<div class='alert alert-info' role='alert'><h3><span class='badge'>" + pageNo + "</span></h3><br><br><h4>Owner Address : </h4>" + data[0] + "<br><br><h4>Car Description : </h4>" + data[1] + "<br><br><h4>TimesTamp : </h4>" + new Date(data[2] * 1000) + "</div>"
                                        status.style.color = "green";
                                        status.innerHTML = "successfully read the page !!!"
        
                                        status.style.color = "green";
                                        status.innerHTML = "You successfully paid !!!"
        
                                        //waite for receipt , res is the HASH from above
                                        web3.eth.getTransactionReceipt(res, function (err, receipt) {
                                            if (err) {
                                              alert("Error receiving receipt details.")
                                            }
                                        
                                            if (receipt !== null) {
                                              // Transaction went through
                                              console.log("receipt details : " )
                                              console.log(receipt)
                                            } else {
                                              // Try again in 1 second
                                              console.log("Please wait until get the receipt ...")
                                              window.setTimeout(function () {
                                                waitForReceipt(hash, cb);
                                              }, 1000);
                                            }
                                          });


                                    }
                                })
        
                            }

                            if (counter == 1 && (a) == (result - 1) && (b) == ((block.transactions.length) - 1)) {
                                //if there is transaction
                                readPageResult.innerHTML += "<div class='alert alert-info' role='alert'><h3><span class='badge'>" + pageNo + "</span></h3><br><br><h4>Owner Address : </h4>" + data[0] + "<br><br><h4>Car Description : </h4>" + data[1] + "<br><br><h4>TimesTamp : </h4>" + new Date(data[2] * 1000) + "</div>"
                                status.style.color = "green";
                                status.innerHTML = "successfully read the page !!!"
                            }


    
                        }
    
    
                    })
    
                }
    
            })

        })

    },
    payForHistory: function () {

        web3.eth.sendTransaction({
            from: account,
            to: "0x662f90cae19e15c8f7c2fa643251307e129e72d0",
            gasLimit: 5000,
            gasPrice: 2000,
            value: 50000
        }, function (err, res) {
            console.log(err)
            console.log(res)
        })

    },
    getAllTransactionCount: function () {
        web3.eth.getTransactionCount(account, function (err, result) {
            console.log(err)
            console.log(result)
        });

    },
    getAllBlockData:  function () {
        web3.eth.getBlockNumber(function(error, result){
            console.log(error)
            console.log(result)

            //current block number
            var n = result;

            //brute-force-checking
            var txs = [];
            for (var i = 0; i < n; i++) {
                web3.eth.getBlock(i, true, function (err, block) {

                    console.log(block)
                    for (var j = 0; j < block.transactions.length; j++) {
                        if (block.transactions[j].to == "0xeae5c7d35d80a6796556b79b05692d8eba34fe0b"){
                            txs.push(block.transactions[j]);
                            console.log("found a transaction")
                        }
                           
                    }

                });

            }
            console.log(txs)

        })
    },
};

window.App = App;

window.addEventListener('load', function () {
    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (typeof web3 !== 'undefined') {
        console.warn(
            'Using web3 detected from external source.' +
            ' If you find that your accounts don\'t appear or you have 0 MetaCoin,' +
            ' ensure you\'ve configured that source properly.' +
            ' If using MetaMask, see the following link.' +
            ' Feel free to delete this warning. :)' +
            ' http://truffleframework.com/tutorials/truffle-and-metamask'
        );
        // Use Mist/MetaMask's provider
        window.web3 = new Web3(web3.currentProvider);
    } else {
        console.warn(
            'No web3 detected. Falling back to http://127.0.0.1:8545.' +
            ' You should remove this fallback when you deploy live, as it\'s inherently insecure.' +
            ' Consider switching to Metamask for development.' +
            ' More info here: http://truffleframework.com/tutorials/truffle-and-metamask'
        );
        // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
        window.web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8545'));
    }

    App.start();
});

