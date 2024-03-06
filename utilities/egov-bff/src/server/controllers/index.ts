import { listener } from '../Kafka/Listener';
import genericAPIController from "./genericAPIService/GenericAPIController.controller";
import campaignManageController from "./campaignManage/campaignManage.controller";
import dataManageController from "./dataManage/dataManage.controller";

// Call the listener function to start consuming messages
listener();

const controllers = [
  new genericAPIController(),
  new campaignManageController(),
  new dataManageController()
]

export default controllers;