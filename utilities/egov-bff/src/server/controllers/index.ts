import BulkUploadController from "./uploadSheet/uploadSheet.controller";
import { listener } from './uploadSheet/Consumer';

// Call the listener function to start consuming messages
listener();




const controllers = [
  new BulkUploadController()
]

export default controllers;