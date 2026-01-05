// import { TouchableOpacity, Image, Text, StyleSheet } from "react-native";
// import * as WebBrowser from "expo-web-browser";
// import * as Google from "expo-auth-session/providers/google";
// import React from "react";
// import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
// import { auth } from "@/firebaseConfig";

// //Allow open OAth popup
// WebBrowser.maybeCompleteAuthSession();
// export default function GoogleSignInButton() {

//   const [request, response, promptAsync] = Google.useAuthRequest({
//     clientId: "AIzaSyA-d1-tSRkfIBMAobKEP4Xh-7qAWfjuz8k",
//     // iosClientId: "IOS_CLIENT_ID",
//     androidClientId: "AIzaSyDnb1TJCitDtzJkNXjINpC5SDASouXy0Xo",
//     webClientId: "390678609917-gnckcnc1sdotjvmms2mgtab88g05f36k.apps.googleusercontent.com", // Rất quan trọng với Firebase
//   });

//   React.useEffect(() => {
//     if (response?.type === "success") {
//       const { idToken } = response.authentication!;
//       const credential = GoogleAuthProvider.credential(idToken);
//       signInWithCredential(auth, credential).catch(console.error);
//     }
//   }, [response]);

//   return (
//     <TouchableOpacity style={styles.googleButton}>
//       <Image 
//         source={require('../assets/images/google-icon.png')} 
//         style={{width: 24, height: 24}}
//       />
//       <Text style={styles.socialButtonText}>Google</Text>
//     </TouchableOpacity>
//   )
// }

// const styles = StyleSheet.create({
//   socialButtonText: {
//     marginLeft: 10,
//     fontSize: 16,
//     fontWeight: '500',
//   },
//   googleButton: {
//     flexDirection: 'row',
//     backgroundColor: '#F5F5F5',
//     paddingVertical: 12,
//     borderRadius: 15,
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginBottom: 20,
//     borderWidth: 1,
//     borderColor: '#ddd',
//     marginTop: 15
//   },
// })