const fstat = require("fs");

const requestHandler = (req, res) => {
  const url = req.url;
  const method = req.method;

  if (url == "/") {
    res.write("<html>");
    res.write("<head><title>Enter Message</title></head>");
    res.write(
      '<body><form action="/message" method="POST"><input type="text" name="message">'
    );
    res.write('<button type="submit">Send</button>');
    res.write("</body>");
    res.write("</html>");
    return res.end();
  }

  if (url == "/message" && method == "POST") {
    // fstat.write('message.txt','Hello World, Developer Here');

    /*The below section is the payload section which means that here we are handling the data user is giving us. This is typically done with req.on function which, in good practice, should inclue data and end resp.  */

    /* req.on(data) means here we are dealing with the payload data which is coming to us. Data does not come in full package but in chunks so we need to handle each chunk individually. One way is to push it in an array like we did here */
    const body = [];
    req.on("data", (chunk) => {
      console.log(chunk);
      body.push(chunk);
    });

    /* Now that we have our data chunks in body array, we can return the end function which will have a callback function. Note we need to return the function as Js is async in nature and if we do not return right now then it will just register the function and will not execute the function. As a result 2 headers will be assigned to the same request leading to an error. One way to avoid this is to use writeFileSync method which will force Js to work in sync way (which is slow if our file is very large). To overcome this, we return the on function so that Js executes it and then we use writeFile and then use a callback function (with err as argument incase something unexpected happens). In the callback function we use the write head function and then return with res.end() signifying the response has ended. */
    return req.on("end", () => {
      const parsedBody = Buffer.concat(body).toString();
      const message = parsedBody.split("=")[1];
      console.log(message);
      fstat.writeFile("message.text", message, (err) => {
        /*  write head basically tells what is the status of the header. Like 404, 302 (found) etc. After that it accepts Js object which here is Location (like we used to do setHeader but here Nature of the message is not Content-Type but Location) and its location is '/'.  */
        res.writeHead(302, { Location: "/" });
        return res.end();
      });
    });
  }

  /* Header basically tells the user what kind of data is incoming from the server. Here we are displaying a data in text and HTML format. Content-Type is the nature of our header and its subtype is text/html */
  res.setHeader("Content-Type", "text/html");
  res.write("<html>");
  res.write("<head><title>My First Web Page</title></head>");
  res.write("<body><h1>Hello<h1></body>");
  res.write("</html>");
  res.end();
};

/*
    This is where we export the function such that it can be used by other files also. exports is the keyword here and then we name however we want to name it (and by the name other files will see it) and then we will assign it as the function name.
    There are multiples ways to do it. Some are

    1.) module.exports = requestHandler (if we want to export only one function from the file)

    2.) module.exports.handler = requestHandler (current one being used is its shortcut, for exporting mutiple functions do the same thing again and again or use the below way).

    3.) module.exports = {
                        handler : requestHandler,
                        txt : "Some hard coded text"
                    }
    
 */
// exports.handler = requestHandler;
exports.handler = requestHandler;
