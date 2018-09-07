pragma solidity ^0.4.4;


contract SmartCarStorage {
    
  // if anything goes wrong the Contract can recover it transactipm cost
  // because of payable constructor
  constructor() public payable {} 

  // struct for keep tracking the car information 
  struct CarInfo {
    string owner_name;
    address owner_Id;
    address previous_owner_Id;
    string car_description;
    uint timestamp;
    string secret;
  }

  // map for keep tracking the car information 
  mapping(uint=>CarInfo) Trail;

  // tracking variable for map current index
  uint8 trailCount = 0;

  // add car information to the contract memory 
  function addCarInfo(string _ownerName, address _ownerId, string _carDesc, string _secret) public {

    CarInfo memory newCarInfo;
    newCarInfo.owner_name = _ownerName;
    newCarInfo.owner_Id = _ownerId;
    newCarInfo.car_description = _carDesc;
    newCarInfo.secret = _secret;
    newCarInfo.timestamp = now;

    if(trailCount != 0) {
      newCarInfo.previous_owner_Id = Trail[trailCount].owner_Id;
    }

    Trail[trailCount] = newCarInfo;
    trailCount++;

  }

  // retrieve the TrailCount
  function getTrailCount() public returns(uint8) {
    return trailCount;
  }

  // this method will return the car information related to supplied trailNo
  function getCarInfo(uint8 trailNo) public returns (string, string, uint, string) {
    return (Trail[trailNo].owner_name, Trail[trailNo].car_description,
              Trail[trailNo].timestamp, Trail[trailNo].secret);
  }
  

  // this method will return the car information related to supplied trailNo and user address
  function getPrevAndNext(uint8 trailNo, address user_address) public returns (string, string, uint, string){
      
      require(Trail[trailNo].owner_Id == user_address);
      
      return (Trail[trailNo].owner_name, Trail[trailNo].car_description,
              Trail[trailNo].timestamp, Trail[trailNo].secret);
  }

  // this method return the give pageNumber/TrailCount details : for buyers
 function getDetailsForTrailCount(uint8 trailCount) public returns (address, string, uint){

   return (Trail[trailCount].owner_Id,
              Trail[trailCount].car_description, Trail[trailCount].timestamp);

 }

}
