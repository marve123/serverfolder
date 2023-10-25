
// const axios = require('axios')

// exports.sendImgToCloud = async(req, res) => {
//     let { imgfile } = req.body 
//     try {
//      const formData = new FormData
//       formData.append("file", imgfile); 
//       formData.append("upload_preset", "zua79mtx");  
//     console.log(formData) 
//     const cloudName = 'dvcma7mex';
//     const uploadURL = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

//         const response = await axios.post(uploadURL, formData,  { 
//             headers: {
//               'Content-Type': 'multipart/form-data',
//                   'X-Requested-With': 'XMLHttpRequest'
//             }
//             }) 

//           res.status(200).json({
//             message: "Image sent",
//             response: response.data
//           })    
//         //   res.status(400).json({
//         //     message: "Error uploading file",
//         //     response: res.error
//         //   })    
          
//     } catch (err) {
//         console.error(err.message)
//     }

   
// }