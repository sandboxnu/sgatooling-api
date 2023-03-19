class HTTPError extends Error {
    status_code: number;
  
    constructor(message: string, status_code: number) {
        super(message);
        this.status_code = status_code;
    
        // Set the prototype explicitly.
        Object.setPrototypeOf(this, HTTPError.prototype);
    }
}
  
export default HTTPError;