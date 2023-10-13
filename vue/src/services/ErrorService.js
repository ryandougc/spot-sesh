import axios from 'axios'

export default class ErrorService {
    constructor() {
        // this.initHandler()
    }

    static onError(error) {
        // const response = error.response
        // // console.log("Heyo")
        // // console.log(error)

        // if(response && response.status >= 400 && response.status < 405) {
        //     // Handle HTTP errors which involve a bad request

        // }
        // axios.post('http://localhost:3000/logs', {
        //     error: {
        //         type: error.name,
        //         message: error.message,
        //         stack: error.stack
        //     }
        // })

        throw new Error(error)
    }

    static onWarn(error) {

    }

    static onInfo(error) {

    }

    // static onDebug(error) {
    //     const response = error.response;
    //     if (response && response.status >= 400 && response.status < 405) {
    //       // You can handle this differently
    //       this.sentryLogEngine(error);
    //       return false;
    //     }
    //     // Send Error to Log Engine e.g LogRocket
    //     this.logRocketLogEngine(error);
    // }

    // static initHandler() {
    //     const scope = this;
    //     window.onerror = (message, url, lineNo, columnNo, error) => {
    //       console.log(error, "test");
    //       if (error) {
    //         scope.onError(error);
    //         console.log(message, url, lineNo, columnNo, error);
    //       }
    //     };
    // }

    static displayErrorAlert(message) {
        
    }

    // static logRocketLogEngine(error) {
    //     // Implement LogRocket Engine here
    //     console.log(error, "LogRocket");
    //   }

    // static sentryLogEngine(error) {
    //     // Implement Sentry Engine here
    //     console.log(error, "Sentry");
    // }
}