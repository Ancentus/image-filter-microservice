import express, { Router, Request, Response } from 'express';
import bodyParser from 'body-parser';
import { filterImageFromURL, deleteLocalFiles } from './util/util';
import fs from "fs";

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */
  app.get("/filteredimage/", (req: Request, res: Response) => {
    let { image_url } = req.query;

    // Validate image_url
    if (!image_url) {
      return res.status(400)
        .send(`image_url is required`);
    }

    // Filter and return image
    filterImageFromURL(image_url)
      .then(filteredpath => {
        return res.status(200)
          .sendFile(filteredpath);
      })
      .catch(error => {
        return res.status(422)
          .send(`an error occurred`);
      })
      .finally(() => {
        // Get and delete any files in the temp folder
        const tempFolder = __dirname + "/util/tmp";
        fs.readdir(tempFolder, (err, files) => {
          files.forEach(file => {
            const fullpath = __dirname + "/util/tmp/" + file;
            deleteLocalFiles([fullpath]);
          });
        })
      });

  });

  //! END @TODO1

  // Root Endpoint
  // Displays a simple message to the user
  app.get("/", async (req, res) => {
    res.send("try GET /filteredimage?image_url={{}}")
  });


  // Start the Server
  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();