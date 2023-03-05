export const logEvent = (event) => {
  const { eventName, result, requestParams = "" } = event;
  console.log(
    `event: ${eventName} 
     time: ${new Date().toLocaleTimeString()} 
     requestParams: ${requestParams}
     result: ${result}`
  );
};
