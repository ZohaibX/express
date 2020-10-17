import React from 'react';
import axios from '../services/httpServices';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

const ImageUpload = () => {
  const [image, setImage] = useState(null);
  const [imageUrlReceived, setImageUrlReceived] = useState([]);
  const [imagePosted, setImagePost] = useState([]);
  const [pdf, setPdf] = useState(null);
  const [pdfUrlReceived, setPdfUrlReceived] = useState([]);

  //!   GET REQUEST
  useEffect(() => {
    async function fetchData() {
      const { data } = await axios.get('http://localhost:4000/images');
      // we will receive the URLs of every image .. according to their public folder and naming

      const { data: pdfUrls } = await axios.get(
        'http://localhost:4000/images/pdf'
      );

      const arrayOfData = data.map((item) => item.imageUrl);
      // getting exact URL only by the way as an array
      const arrayOfPdfUrls = pdfUrls.map((item) => item.pdfUrl);
      console.log(arrayOfPdfUrls);

      const imageUrlReceived = [...arrayOfData];
      const pdfUrlReceived = [...arrayOfPdfUrls];
      // there is some problem, we normally don't use the state variable like this, if we have to change the value, we should use setVariable

      setImageUrlReceived(imageUrlReceived);
      setPdfUrlReceived(pdfUrlReceived);
    }

    fetchData();
  }, [imagePosted]);

  //   ! Image Loading
  // file change is for -- when we load some picture .. it should be loaded in the state.image
  const onFileChange = (e) => {
    console.log(e.target.files[0]);
    setImage(e.target.files[0]);
    // on change of file .. we will that that file in image state
  };

  //   ! POST REQUEST
  // when we submit picture .. we want to post a request to save it on the backend files and database
  const onSubmit = async (e) => {
    e.preventDefault();

    if (!image) return alert('Image is not selected');

    // form data is an object which will hold data of the form
    // imageUrl is  a File here -- so we will send it as formData
    const formData = new FormData();
    formData.append('image', image, image.name); // its {imageUrl : this.state.imageUrl}
    // console.log(formData.get("image"));

    // posting picture on the backend
    try {
      await axios.post(
        'http://localhost:4000/images', // this will be the api , where we need to send the data - correct api
        formData,
        {
          // to show progress
          onUploadProgress: (progressEvent) => {
            console.log(
              'upload progress : ' +
                Math.round((progressEvent.loaded / progressEvent.total) * 100) +
                '%'
            );
          },
        }
      );
      setImagePost(image.name);
    } catch (e) {
      console.log(e);
    }
  };

  const deleteProduct = async () => {
    await axios.delete(
      'http://localhost:4000/images/delete-the-image/5f1ed208c2fc9d2b381fe660'
    ); // we are using a hard coated route and im using user id (image id  from the database ..
    // in the real time , i can use some other way when mapping all the images and their delete button
    // and then we can send some property of the user (like we did in mosh's project with like and delete button) to backend and backend can retrieve information from the database and process it
  };

  const showPdf = () => {
    const returnData = pdfUrlReceived.map((item) => {
      let newItem = item.replace('public\\uploads\\', '');
      // 2 backslashes are counted as 1 and 4 are 2
      // and we are cutting the name from the url
      return (
        <div key={newItem}>
          <a href={`http://localhost:4000/images/pdf-show/${newItem}`}>
            PDF TITLE
          </a>
          <br />
        </div>
      );
    });
    return returnData;
  };

  return (
    <div className='container'>
      <h1>File Uploader Using ReactJS,Multer</h1>
      {showPdf() ? showPdf() : null}
      <div className='row'>
        <form onSubmit={onSubmit}>
          <h1>Single File Uploader</h1>
          <div className='form-group'>
            <input type='file' onChange={onFileChange} />
          </div>
          <div className='form-group'>
            <button className='btn btn-primary' type='submit'>
              Upload
            </button>
          </div>
        </form>

        <a
          className='btn btn-primary'
          href={
            'http://localhost:4000/images/pdf-show/5f8a44beba93ea4720d55a91'
          }
          // i didn't find if we can use react-router-dom Link for no page reload .. bcoz we always load the page to preview pdf
          // we are manually providing any imageId here according to the manually added file naming
          // but we can also provide some id which can be associated to some user ..
          type='submit'
        >
          Invoice Show
        </a>

        <br />

        <a
          className='btn btn-primary'
          href={`http://localhost:4000/images/pdf-generate/${axios.jwtToken}`}
          // onClick={() => pdfGen()}
          // we may be able to use Link tag
          // we are manually providing any imageId here
          // here we are generating a pdf
          type='submit'
        >
          Invoice Generate
        </a>

        <br />

        <button
          className='btn btn-primary'
          onClick={() => deleteProduct()}
          // i have given it the id of the single object stored in the database ..
          // so we will have to change this id again and again every time whenever we delete one object
          type='submit'
        >
          Delete The Image
        </button>
      </div>

      {/* Showing All The Images  */}
      {imageUrlReceived.map((item) => (
        <img
          key={item}
          style={{
            height: '200px',
            borderRadius: '20px',
          }}
          src={'http://localhost:4000/' + item}
          //   thats how we can use them
          //  item is having ImageURL
          alt=''
        />
      ))}
    </div>
  );
};

export default ImageUpload;
