import admin from "firebase-admin";
import serviceAccount from "../vandal-project-2b16e-firebase-adminsdk-fbsvc-ed111de025.json"; // pastikan path-nya benar

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export default admin;
