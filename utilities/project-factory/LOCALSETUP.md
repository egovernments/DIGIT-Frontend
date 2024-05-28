# Local Setup

To setup the ProjectFactory service in your local system, clone the [Digit Frontend repository](https://github.com/egovernments/DIGIT-Frontend).

## Dependencies

### Infra Dependency

- [x] Postgres DB
- [ ] Redis
- [ ] Elasticsearch
- [x] Kafka
  - [x] Consumer
  - [x] Producer

## Running Locally

### Local setup
1. To setup the ProjectFactory service, clone the [Digit Frontend repository](https://github.com/egovernments/DIGIT-Frontend).
2. Install Node.js version 20 using nvm (Node Version Manager).
3. Update the configs in utilities/project-factory/src/server/config/index.ts, change HOST to "http://localhost:8080/" and KAFKA_BROKER_HOST to "localhost:9092".
4. Also update DB config values as per your local system config.
5. Update all dependency service host either on any unified-env or port-forward.
6. Open the terminal and run the following command

    `cd utilities/project-factory/`
                                                      
    `yarn install`             (run this command only once when you clone the repo)
                                                                                                                                                 
    `yarn dev`

> Note: After running the above command if kafka error comes then make sure that kafka and zookeeper runs in background and if other microservice connection error comes then make sure that in data config the url mentioned in external mapping is correct or you can port-forward that particular service
