import React, { useEffect, useState } from "react";
import { useGoogleLogin, googleLogout } from "@react-oauth/google"; 
import { REACT_API_URL } from "../constants/credentials";
import axios from "axios";

function App() {
  const [isReload,setIsReload] = useState(0);
  
  useEffect(() => {
    const getCertificates = async () => {
      try {
        // Fetch certificates from the API
        const response = await axios.get(`${REACT_API_URL}/api/admin/getLinks`);
        // Extract data from response and update state
        setCertificates(response.data);
      } catch (error) {
        console.error('Error fetching certificates:', error);
      }
    };

    // Call the function to get certificates
    getCertificates();
  }, [isReload]);

  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState([]);
  const [isUploadSet, setIsUploadSet] = useState(false);
  const [certificates,setCertificates] = useState(null);


    // State variables for input fields
    const [name, setName] = useState("");
    const [courseName, setCourseName] = useState("");
    const [completionDate, setCompletionDate] = useState("");
    const [email, setEmail] = useState("");
    const [fileName, setFileName] = useState("");

    const handleSubmit = async (e) => {
      e.preventDefault()
      // Form data
      const formData = {
          name: name,
          courseName: courseName,
          completionDate: completionDate,
          email: email,
          pdfFileName: fileName,
          token:user.access_token
      };
      // const { name, completionDate, courseName, token , pdfFileName, email} = req.body;
      try {
          // Make a POST request to submit the form data
          const response = await fetch(`${REACT_API_URL}/api/admin/upload`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
             },
              body: JSON.stringify(formData)
          });
  
          // Check if request was successful
          if (response.ok) {
            setIsReload(prev => prev + 1);
            alert("Succesfully uploaded to drive , Refresh to see changes")
            // Reset form fields
            setName("");
            setCourseName("");
            setCompletionDate("");
            setEmail("");
            setFileName("");
            console.log('Form submitted successfully!');
          } else {
              // Request failed, handle error (e.g., show error message)
              console.error('Form submission failed.');
          }
      } catch (error) {
          // An error occurred during the request, handle it appropriately
          console.error('Error submitting form:', error);
      }
  };
  

  const login = useGoogleLogin({
    onSuccess: (codeResponse) => setUser(codeResponse),
    onError: (error) => console.log("Login Failed:", error),
    scope: "https://www.googleapis.com/auth/drive.file",
  });

  // log out function to log the user out of google and set the profile array to null
  const logOut = () => {
    googleLogout();
    setProfile(null);
  };

  return isUploadSet ? (
    <div>
      <div class="absolute inset-0 -z-10 max-h-screen w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]">
        <div class="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_500px_at_50%_200px,#C9EBFF,transparent)]"></div>
      </div>

      <div className="w-full max-h-screen overflow-y-scroll relative p-10 text-5xl text-center text-black  font-bold ">
        Edit The Below PDF Template
        <form className="max-w-3xl mx-auto mt-10" onSubmit={handleSubmit}>
        <label class="input mb-4 bg-[#ece3ca] max-w-xl mx-auto input-bordered flex items-center gap-2">
          <input type="text" class="grow" placeholder="Your Name"   onChange={(e) => setName(e.target.value)}/>
          
        </label>
        <label class="input mb-4 max-w-xl bg-[#ece3ca]  mx-auto input-bordered flex items-center gap-2">
          
          <input type="text" class="grow" placeholder="Course Name"   onChange={(e) => setCourseName(e.target.value)}/>
        </label>
        <label class="input mb-4 max-w-xl bg-[#ece3ca]  mx-auto input-bordered flex items-center gap-2">
          
          <input type="text" class="grow" placeholder="Completion Date (DD/MM/YYYY}"   onChange={(e) => setCompletionDate(e.target.value)}/>
        </label>
        <label class="input mb-4 max-w-xl bg-[#ece3ca]  mx-auto input-bordered flex items-center gap-2">
         
          <input type="text" class="grow" placeholder="Your Email"   onChange={(e) => setEmail(e.target.value)}/>
        </label>
        <label class="input mb-4 max-w-xl bg-[#ece3ca]  mx-auto input-bordered flex items-center gap-2">
         
          <input type="text" class="grow" placeholder="File name to be saved in Google Drive ? "   onChange={(e) => setFileName(e.target.value)}/>
        </label>
        <button className="btn btn-primary" type="submit">
          Submit
        </button>
        </form>

        <h1 className="text-left text-3xl mt-10 underline">Your Drive Uploaded PDFs and Links</h1>
        <div className="grid mt-6 text-lg grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {certificates.length > 0 ? (
          certificates.map((certificate, index) => (
            <div key={index} className="bg-neutral-200 card p-4">
              <div className="flex justify-between mb-2">
                <h3 className="text-lg font-semibold">Certificate {index + 1}</h3>
                <div className="badge text-sm">ID: {certificate._id}</div>
              </div>
              <p>Email: {certificate.email}</p>
              <p className="hover:scale-[1.1]">Drive File ID: <a className="border-b-[2px] border-yellow-700 hover:border-yellow-900 " target="_blank" href={`${certificate.driveFileId}`}>{certificate.driveFileId}</a></p>
            </div>
          ))
        ) : (
          <p>No certificates found.</p>
        )}
      </div>
      </div>

    </div>
  ) : (
    <div>
      <div class="fixed left-0 top-0 -z-10 h-full w-full">
        <div class="absolute inset-0 -z-10 h-full w-full bg-white [background:radial-gradient(125%_125%_at_50%_10%,#fff_40%,#63e_100%)]"></div>
      </div>
      <div className="w-full min-h-screen relative p-10">
        <div className="max-w-5xl mx-auto mb-10">
          <h1 className="text-6xl text-center mb-4 max-w-xl font-extrabold text-[#000000]">
            Certify PDF App
          </h1>
        </div>
        <div className="max-w-4xl  mx-auto">
          <p className="text-xl text-slate-800">
            Certify PDF simplifies editing PDFs and storing them securely in
            Google Drive. Customize templates effortlessly and store them with
            confidence. Easily certify important documents and ensure their
            authenticity.
          </p>
          <div className="mt-6"></div>
          <div className="max-w-[220px] mx-auto sm:max-w-none flex flex-col sm:flex-row sm:justify-center mt-6">
            <div className="mt-5 flex flex-col sm:mt-0 sm:ml-5">
              {" "}
              <button
                className="btn w-full sm:w-auto text-white bg-indigo-500 hover:bg-indigo-600 group"
                onClick={() => {
                  if (!user) {
                    login();
                  } else if (user) {
                    setIsUploadSet(true);
                  }
                }}
              >
                {!user ? "Sign In With Google" : "Go To Upload Section"}
              </button>
              {user && (
                <button
                  className="btn w-full sm:w-auto text-white bg-neutral-500 hover:bg-neutral-600 group mt-4"
                  onClick={() => logOut()}
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="mt-24 w-full flex justify-center items-center">
          <div class="chat chat-start mx-auto ">
            <div class="chat-image avatar">
              <div class="w-20 rounded-full ">
                <img
                  alt="Tailwind CSS chat bubble component"
                  src="https://wallpapers.com/images/hd/cute-funny-cat-pictures-93mkt479cwb3d1rd.jpg"
                />
              </div>
            </div>
            <div class="chat-bubble text-lg">
              Hey there! So, about the landing page... It's a bit basic right
              now, I know. Just gonna blame it on the whole 'not enough hours in
              the day' thing for now. For now kindly use the app 🙂 <br />
              <strong>- Subbu</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
