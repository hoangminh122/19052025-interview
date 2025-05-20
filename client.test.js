
const axios = require("axios");


// const test = Array.from(Array(20000).keys());
const users = [];

for(let i =0 ;i < 10000; i++) {
  users.push({
    email: `string${i}@gmail.com`,
    password: "string"
  })
}

setTimeout(async() => {
  const test = await Promise.all(
    users.map(_=> {
     return axios({
        method: 'post',
        url: 'http://127.0.0.1:7001/auth/register',
        data: {
          email: _.email,
          password: _.password
        }
      });
    })
  )
  console.log(test.map(x=> x))
},8000);

// setTimeout(async() => {
//   const test = await Promise.all(
//     users.map(_=> {
//      return axios({
//         method: 'post',
//         url: 'http://127.0.0.1:7001/auth/login',
//         data: {
//           email: _.email,
//           password: _.password
//         }
//       });
//     })
//   )
//   console.log(test.map(x=> x?.data?.access_token))
// });
