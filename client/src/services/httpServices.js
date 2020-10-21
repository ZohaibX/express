import axios from 'axios';

axios.interceptors.response.use(null, (error) => {
  const expectedError =
    error.response &&
    error.response.status >= 400 &&
    error.response.status < 500;

  if (!expectedError) {
    console.log(error);

    alert('An unexpected error occurrred.');
  }

  return Promise.reject(error);
});

export function setJwtHeader(jwt) {
  // laazmi
  // we'll set this in loginUserServices where all the operations on jwt are working
  axios.defaults.headers.common['authorization'] = jwt; // so we can change it easily in other projects
}

const jwtToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNWY4YTk3NTU1NWFmNTczY2I0NGNmZGRiIiwiZW1haWwiOiJ0ZXN0MiIsInVzZXJuYW1lIjoidGVzdDEiLCJ1c2VyTGV2ZWwiOiJIT0QiLCJhZG1pbiI6ZmFsc2UsImlhdCI6MTYwMzExNjM1NSwiZXhwIjoxNjAzMTE5OTU1fQ.kZ7xdnCPBSFlfsaDVGh_Iu4mM4NGOglcjsisQTbBQLU';

setJwtHeader(jwtToken);

export default {
  get: axios.get,
  post: axios.post,
  put: axios.put,
  delete: axios.delete,
  setJwtHeader,
  jwtToken,
};
