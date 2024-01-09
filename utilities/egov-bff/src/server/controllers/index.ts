import ProcessMicroplanController from "./processMicroplan/ProcessMicroplanController.controller";
import TransformController from "./bulkTransform/TransformController.controller";
import { listener } from '../Kafka/Listener';

// Call the listener function to start consuming messages
listener();

const controllers = [
  new ProcessMicroplanController(),
  new TransformController()
]

export default controllers;