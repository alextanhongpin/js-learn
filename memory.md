# Dealing with nodejs memory issue


Short term solution
- restart the application before it crashes
- pm2 can monitor the memory and restart the application when it reaches a certain threshold (max_memory_restart)


Debugging memory leak
- check the active requests and active handles for nodejs processes
- active handles are references to an open resource like an opened file,  database connection or a request (what is a more precise definition?)
- when the connection is not closed, active handles count will increase, and we will have memory leak
- to get count, we can use the function process._getActiveHandles() and process._getActiveRequests() respectively
- packages like wtfnode allows us to debug the active handles usage

References:

- https://medium.com/trabe/detecting-node-js-active-handles-with-wtfnode-704e91f2b120
- https://github.com/davidmarkclements/overload-protection
