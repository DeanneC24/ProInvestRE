# [ProInvestRE](https://pro-invest-re-frontend.onrender.com/) Application

- [Overview](#overview)
- [Getting Started](#getting-started)
    - [Running ProInvestRE Locally](#running-proinvestre-locally)
    - [Accessing Production ProInvestRE](#accessing-production-proinvestre)
- [Tech Stack and Project Management](#tech-stack-and-project-management)
    - [Frontend](#frontend)
    - [Backend](#backend)
    - [Data Source](#data-source) 
    - [CI/CD](#cicd)

- [Project Management](#project-management)
- [Work Remaining](#work-remaining)


## Overview
This repository contains the code for my submission for the CBF Return to Tech Final Project.

This application is a tool for prospective real estate investors. Users can search for a particular postcode or outcode (first part of a postcode) and retrieve key metrics for that particular outcode. Users can then use this information to make an informed decision about the area or region to make their next investment.

It's worth noting that certain aspects of the project remain unfinished due to an unexpected change in the project schedule. These incomplete elements will be elaborated upon in the sections below.


## Getting Started

### Running ProInvestRE Locally

#### Prerequisites

This application has been dockerized for XXX reason. To run the application locally, please ensure you have docker and docker compose installed on your system.

#### Setting Environment Variables

To run the ProInvestRE backend application, you need to set up the required environment variables. These variables contain essential configuration details for your application. Create a .env file in the project's root directory and add XXX env vars.

- `NODE_ENV`
- `ELASTICSEARCH_ADMIN_APIKEY`
- `ELASTICSEARCH_CLOUD_ID`
- `BACKEND_BASE_URL`

#### Running ProInvestRE Locally

Now that you've set up the environment variables, you can launch ProInvestRE using Docker. Open a terminal and navigate to the project's root directory. Then, use the following commands:

~~~shell
# This will build the containers and start the applications
$ docker compose up --build
~~~

#### Accessing the Application

Once docker compose has finished building the URL for the frontend application will be displayed in the logs. Follow the link to access your local instance of ProInvestRE.

#### Stopping the Application
Run the following command to stop your instance of ProInvestRE.
~~~shell
# This will stop and remove the containers/
$ docker compose down
~~~

### Accessing Production ProInvestRE

Use [this](https://pro-invest-re-frontend.onrender.com/)
 link to access the production instance of ProInvestRE

**Important:**  The Elasticsearch deployment will expire in **8 days** after which it cannot be extended due to limits on their free trials.


## Tech Stack and Project Management

### Frontend
The frontend has been built in typescript using the react framework.

### Backend
The backend has been built in typescript using Node.js and the express web server framework.

### Data Source

The data source for this project is the ``postcode-key-stats`` endpoint from [PropertyData](https://propertydata.co.uk/api/documentation/postcode-key-stats). This data was processed via an ingest pipeline I personally designed, and subsequently, it was ingested into Elasticsearch. The resulting index serves as the primary means to query the data source, allowing us to retrieve the metrics that are displayed within the application.

## CI/CD
GitHub Actions was employed to establish a robust CI/CD pipeline for this application. You can find the `deploy.yml` file within the repository. This pipeline comprises several key steps:

1. **Testing**: It begins with running tests for both the frontend and backend components to ensure the application's integrity. The test stage includes a coverage report.

2. **Docker Image Build**: Following successful tests, the pipeline proceeds to build Docker images for your application's services. These Docker images encapsulate the application's environment, making it portable and reproducible.

3. **DockerHub Push**: The newly created Docker images are then securely pushed to DockerHub. This ensures that the latest version of the application's images are available for deployment.

4. **Render Deployment**: In the final step, the pipeline triggers a deployment on Render, which picks up the updated Docker images. This ensures that the application on Render is always running the most up-to-date version.

This CI/CD process automates testing, image building, and deployment, enhancing the efficiency and reliability of the application's development and delivery cycle.


## Project Management
Throughout the development of this project, I adhered to the agile methodology, which facilitated efficient project management and collaboration. One notable aspect of this approach was my utilization of a Kanban board to visualize and streamline tasks. My Kanban board can be found [here](https://miro.com/app/board/uXjVMqZZKQA=/?share_link_id=776235598427) This board served as a dynamic tool for tracking progress, managing work in progress, and ensuring transparent project management.

The project management and planning records for this project can be found [here](https://miro.com/app/board/uXjVMqZZKQA=/?share_link_id=776235598427).

## Work Remaining
As mention previously, the deadline for the project was brought forward meaning less time to complete the project. As such, I prioritised completely the basic functionality of the application in order to meet the deadline. The following items are remaining to produce a cleaner, more reliable and more functional application:

- Admin page and enforcement of admin privileges to write to Elasticsearch
    - Work on this was started but not completed - see `authentication-service` in the backend code
- Additional test cases to improve edge case handling 
- Implementation of application monitoring with Grafana
