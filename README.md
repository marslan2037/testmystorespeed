# Speedchecker (Front-end)

Front-end for speedchecker app. 

Build with using only functional components. For state management  I used ```useState()``` from React [Hooks API](https://reactjs.org/docs/hooks-reference.html). This allows functional components to use state.

```<Main />``` component calls backend API and saves JSON response in a state. This response contains all needed data for all pages.

This component also has dummy data mode. This will use dummy data instead of calling the API. Intended to save time during development.
```
const debugMode = true
```

```<Results />```  component contains all logic for displaying  test results.
It has owner tab and developer tab.

```<RowDev />``` and ```<RowOwner />``` are formating and rendering data.

This version lacks:
---
* Har viewer (network watterfall)
* HistoryChart Page
* Loading



Built with [create-react-app](https://github.com/facebook/create-react-app).

## Installation


Clone the repo.

```bash
git clone git@gitlab.com:ecom_experts.io/speedchecker-frontend.git
```


Use the [yarn](https://yarnpkg.com/lang/en/) to install dependencies.

```bash
yarn install
```


## Dev mode

Run locally with hot reloading. (Runs start script from react-scripts.)
```
yarn dev
```
## Production

Run build script from react-scripts
```
yarn build
```
Start express server. Serve ./build folder.
```
yarn start
```



## Built With

* [React](https://github.com/facebook/react) - The front-end framework
* [Create React App](https://github.com/facebook/create-react-app) - Set up a modern web app by running one command.
* [MongoDB](https://www.mongodb.com/cloud/atlas) - Database
* [Express](https://expressjs.com/) - Fast, unopinionated, minimalist web framework for Node.js