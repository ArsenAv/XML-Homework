

const STATE = {
    PENDING: 'PENDING',
    FULFILLED: 'FULFILLED',
    REJECTED: 'REJECTED',
   
  }
   


  class MyPromise {
      constructor(callback) { 
        this.state = STATE.PENDING;
        this.value = undefined;
        this.handlers = [];
     
        try {
          callback(this._resolve, this._reject);
        } catch (err) {
          this._reject(err)
        }
      }
    
      _resolve = (value) => {
        this.updateResult(value, STATE.FULFILLED);
      }
    
      _reject = (error) => {
        this.updateResult(error, STATE.REJECTED);
      }

   

      updateResult(value, state) {
       
        setTimeout(() => {
     
          if (this.state !== STATE.PENDING) {
            return;
          }
        
         
          if (isThenable(value)) {
            return value.then(this._resolve, this._reject);
          }
          
          this.value = value;
          this.state = state;
          


          function isThenable (value) {
            if (typeof value === "object" && value !== null && value.then && typeof value.then === "function") {
              return true;
            }
            return false;
          }
          
          this.executeHandlers();
        }, 0);
      }
      

  

      then(onSuccess, onFail) {
        return new MyPromise((res, rej) => {
            this.addHandlers({
              onSuccess: function(value) {
        
                if (!onSuccess) {
                  return res(value);
                }
                try {
                  return res(onSuccess(value))
                } catch(err) {
                  return rej(err);
                }
              },
              onFail: function(value) {
              
                if (!onFail) {
                  return rej(value);
                }
                try {
                  return res(onFail(value))
                } catch(err) {
                  return rej(err);
                }
              }
            });
        });
      }
      
      addHandlers(handlers) {
        this.handlers.push(handlers);
        this.executeHandlers();
      }
      
      executeHandlers() {

        if (this.state === STATE.PENDING) {
          return null;
        }

        this.handlers.forEach((handler) => {
          if (this.state === STATE.FULFILLED) {
            return handler.onSuccess(this.value);
          } 
          return handler.onFail(this.value);
        });
      
        this.handlers = [];


      }
      
    
      catch(onFail) {
        return this.then(null, onFail);
      }
      
      finally(callback) {
        let val;
        let wasRejected;
        this.then((value) => {
          wasRejected = false;
          val = value;
          return callback();
        }, (err) => {
          wasRejected = true;
          val = err;
          return callback();
        }).then(() => {
    
          if(!wasRejected) {
            return res(val);
          } 
          return rej(val);
        })
     }
      }
  
//AJAX

function ajax(url,config){
    return new MyPromise(function(_resolve,_reject){
         const xhr = new XMLHttpRequest();
         for(header in headers){
            xhr.setRequestHeader(header,value)
         }
         xhr.open(config.type, url);
         xhr.send(config.data);
    })
}

const p1 = ajax("more.html", {
  type: "GET",
  headers: {},
  data: {}
}).then(() => {}).catch(() => {})


const p2 = ajax("more.html", {
  type: "GET" ,
  headers: {},
  data: {}
}).then(() => {}).catch(() => {})

const p3 = ajax("more.html", {
  type: "GET" ,
  headers: {},
  data: {}
}).then(() => {}).catch(() => {})



console.log(p1,p2,p3)