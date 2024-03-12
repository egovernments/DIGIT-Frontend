import { listener } from '../Kafka/Listener';
import campaignManageController from "./campaignManage/campaignManage.controller";
import dataManageController from "./dataManage/dataManage.controller";
import genericApiManageController from './genericApiManage/genericApiManage.controller';

// Call the listener function to start consuming messages
listener();

const controllers = [
  new campaignManageController(),
  new dataManageController(),
  new genericApiManageController()
]

export default controllers;