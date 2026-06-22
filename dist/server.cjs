

   import { createRequire } from 'module';

   const require = createRequire(import.meta.url);

  
"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/app.ts
var import_express4 = __toESM(require("express"), 1);

// src/modules/user/user.route.ts
var import_express = require("express");

// src/db/index.ts
var import_pg = require("pg");

// src/config/index.ts
var import_dotenv = __toESM(require("dotenv"), 1);
var import_path = __toESM(require("path"), 1);
import_dotenv.default.config({
  path: import_path.default.join(process.cwd(), ".env")
});
var config = {
  connection_sting: process.env.CONNECTION_STRING,
  port: process.env.PORT,
  secret: process.env.JWT_SECRET,
  refresh_secret: process.env.JWT_REFRESH_SECRET
};
var config_default = config;

// src/db/index.ts
var pool = new import_pg.Pool({
  connectionString: config_default.connection_sting
});
var initDB = async () => {
  try {
    await pool.query(`
            CREATE TABLE IF NOT EXISTS users(
            id SERIAL PRIMARY KEY,
            name VARCHAR(20),
            email VARCHAR(20) UNIQUE NOT NULL,
            password TEXT NOT NULL,
            is_active BOOLEAN DEFAULT true,
            age INT,
            role VARCHAR(10) DEFAULT 'user',
            
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
            )
            `);
    await pool.query(`
            CREATE TABLE IF NOT EXISTS profiles(
            id SERIAL PRIMARY KEY,
            user_id INT UNIQUE REFERENCES users(id) ON DELETE CASCADE,

            bio TEXT,
            address TEXT,
            phone VARCHAR(15),
            gender VARCHAR(10),
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
            )
            `);
    console.log("Database connected successfully");
  } catch (error) {
    console.log(error);
  }
};

// src/modules/user/user.service.ts
var import_pg2 = require("pg");
var import_bcryptjs = __toESM(require("bcryptjs"), 1);
var createUserIntoDB = async (payload) => {
  const { name, email, password, age, role } = payload;
  const hashPAssword = await import_bcryptjs.default.hash(password, 10);
  const result = await pool.query(`    
        INSERT INTO users(name, email, password, age, role) VALUES($1, $2, $3, $4, COALESCE($5, '>user')) RETURNING * ;
    `, [name, email, hashPAssword, age, role]);
  delete result.rows[0].password;
  return result;
};
var getAllUsersFromDB = async () => {
  const result = await pool.query(`
        SELECT * FROM users
        `);
  delete result.rows[0].password;
  return result;
};
var getSingleUserFromDB = async (id) => {
  const result = await pool.query(`SELECT * FROM users WHERE id = $1;`, [id]);
  return result;
};
var updateUserFromDB = async (payload, id) => {
  const { name, password, age, is_active } = payload;
  const result = await pool.query(
    `
            UPDATE users
            SET 
            name = COALESCE($1, name),
            password= COALESCE($2, password),
            age=COALESCE($3, age),
            is_active=COALESCE($4, is_active)

            WHERE id = $5 
            RETURNING *
            `,
    [name, password, age, is_active, id]
  );
  delete result.rows[0].password;
  return result;
};
var deleteUserFromDB = async (id) => {
  const result = await pool.query(
    `
            DELETE FROM users
            WHERE id = $1
            `,
    [id]
  );
  return result;
};
var userService = {
  createUserIntoDB,
  getAllUsersFromDB,
  getSingleUserFromDB,
  updateUserFromDB,
  deleteUserFromDB
};

// src/utility/sendResponse.ts
var sendResponse = (res, data) => {
  res.status(data.statusCode).json({
    success: data.success,
    message: data.message,
    data: data.data,
    error: data.error
  });
};
var sendResponse_default = sendResponse;

// src/modules/user/user.controller.ts
var createUser = async (req, res) => {
  try {
    const result = await userService.createUserIntoDB(req.body);
    sendResponse_default(res, {
      statusCode: 201,
      success: true,
      message: "User Created Successfully!",
      data: result.rows[0]
    });
  } catch (error) {
    sendResponse_default(res, {
      statusCode: 500,
      success: false,
      message: error.message,
      error
    });
  }
};
var getAllUsers = async (req, res) => {
  console.log("Controller", req.user);
  try {
    const result = await userService.getAllUsersFromDB();
    res.status(200).json({
      message: "Express Server",
      Author: "Subroto Chanda shuvo",
      data: result.rows
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      error
    });
  }
};
var getSingleUser = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await userService.getSingleUserFromDB(id);
    if (result.rows.length === 0) {
      return res.status(500).json({
        success: false,
        message: "User not found!",
        data: {}
      });
    }
    res.status(200).json({
      success: true,
      message: "User retrieved successfully!",
      data: result.rows[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      error
    });
  }
};
var updateUser = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await userService.updateUserFromDB(req.body, id);
    if (result.rows.length === 0) {
      return res.status(500).json({
        success: false,
        message: "User not found!",
        data: {}
      });
    }
    res.status(200).json({
      success: true,
      message: "Users retrieved successfully!",
      data: result.rows
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      error
    });
  }
};
var deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await userService.deleteUserFromDB(id);
    if (result.rowCount === 0) {
      return res.status(500).json({
        success: false,
        message: "User not found!",
        data: {}
      });
    }
    res.status(200).json({
      success: true,
      message: "Users retrieved successfully!",
      data: result.rows
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      error
    });
  }
};
var userController = {
  createUser,
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser
};

// src/middleware/auth.ts
var import_jsonwebtoken = __toESM(require("jsonwebtoken"), 1);
var auth = (...roles) => {
  return async (req, res, next) => {
    console.log(roles);
    try {
      const token = req.headers.authorization;
      if (!token) {
        res.status(401).json({
          success: false,
          message: "Unauthorized access! "
        });
      }
      const decoded = import_jsonwebtoken.default.verify(token, config_default.secret);
      const userData = await pool.query(`
        SELECT * FROM users WHERE email = $1
        `, [decoded.email]);
      const user = userData.rows[0];
      if (userData.rows.length === 0) {
        res.status(404).json({
          success: false,
          message: "User not found!"
        });
      }
      if (!user?.is_active) {
        res.status(403).json({
          success: false,
          message: "Forbidden! "
        });
      }
      if (roles.length && !roles.includes(user.role)) {
        res.status(403).json({
          success: false,
          message: "Forbidden! This role have no access!"
        });
      }
      req.user = decoded;
      next();
    } catch (error) {
      next(error);
    }
  };
};
var auth_default = auth;

// src/types/index.ts
var USER_ROLE = {
  admin: "admin",
  agent: "agent",
  user: "user"
};

// src/modules/user/user.route.ts
var router = (0, import_express.Router)();
router.post("/", userController.createUser);
router.get("/", auth_default(USER_ROLE.admin, USER_ROLE.agent), userController.getAllUsers);
router.get("/:id", userController.getSingleUser);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);
var userRoute = router;

// src/modules/profile/profile.route.ts
var import_express2 = require("express");

// src/modules/profile/profile.service.ts
var createProfileIntoDB = async (payload) => {
  const { user_id, bio, address, phone, gender } = payload;
  const user = await pool.query(`
        SELECT * FROM users WHERE id=$1
        `, [user_id]);
  if (user.rows.length === 0) {
    throw new Error("User not exists!");
  }
  const result = await pool.query(`
        INSERT INTO profiles(
        user_id, bio, address, phone, gender
        ) VALUES($1,$2,$3,$4,$5) RETURNING *
        `, [user_id, bio, address, phone, gender]);
  return result;
};
var getAllProfileFromDB = async () => {
  const result = await pool.query(`
        SELECT * FROM profiles
        `);
  return result;
};
var profileService = {
  createProfileIntoDB,
  getAllProfileFromDB
};

// src/modules/profile/profile.controller.ts
var createProfile = async (req, res) => {
  try {
    const result = await profileService.createProfileIntoDB(req.body);
    res.status(201).json({
      success: true,
      message: "Profile created successfully!",
      data: result.rows[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      error
    });
  }
};
var getAllProfile = async (req, res) => {
  try {
    const result = await profileService.getAllProfileFromDB();
    res.status(200).json({
      success: true,
      message: "Get all Profiles successfully!",
      data: result.rows
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      error
    });
  }
};
var profileController = {
  createProfile,
  getAllProfile
};

// src/modules/profile/profile.route.ts
var router2 = (0, import_express2.Router)();
router2.post("/", profileController.createProfile);
router2.get("/", profileController.getAllProfile);
var profileRoute = router2;

// src/modules/auth/auth.route.ts
var import_express3 = require("express");

// src/modules/auth/auth.service.ts
var import_bcryptjs2 = __toESM(require("bcryptjs"), 1);
var import_jsonwebtoken2 = __toESM(require("jsonwebtoken"), 1);
var loginUserIntoDB = async (payload) => {
  const { email, password } = payload;
  const userData = await pool.query(
    `
        SELECT * FROM users
        WHERE 
        email = $1
        `,
    [email]
  );
  if (userData.rows.length === 0) {
    throw new Error("Invalid Credentials");
  }
  const user = userData.rows[0];
  const matchPassword = await import_bcryptjs2.default.compare(password, user.password);
  if (!matchPassword) {
    throw new Error("Invalid Credentials");
  }
  const jwtPayload = {
    id: user.id,
    name: user.name,
    role: user.role,
    is_active: user.is_active,
    email: user.email
  };
  const accessToken = import_jsonwebtoken2.default.sign(
    jwtPayload,
    config_default.secret,
    { expiresIn: "1d" }
  );
  const refreshToken2 = import_jsonwebtoken2.default.sign(
    jwtPayload,
    config_default.refresh_secret,
    { expiresIn: "10d" }
  );
  return { accessToken, refreshToken: refreshToken2 };
};
var generateRefreshToken = async (token) => {
  if (!token) {
    throw new Error("Unauthorized!!");
  }
  const decoded = import_jsonwebtoken2.default.verify(token, config_default.refresh_secret);
  const userData = await pool.query(`
        SELECT * FROM users WHERE email = $1
        `, [decoded.email]);
  const user = userData.rows[0];
  if (userData.rows.length === 0) {
    throw new Error("User not found!!");
  }
  if (!user?.is_active) {
    throw new Error("Forbidden!!");
  }
  const jwtPayload = {
    id: user.id,
    name: user.name,
    role: user.role,
    is_active: user.is_active,
    email: user.email
  };
  const accessToken = import_jsonwebtoken2.default.sign(
    jwtPayload,
    config_default.secret,
    { expiresIn: "1d" }
  );
  return { accessToken };
};
var authService = {
  loginUserIntoDB,
  generateRefreshToken
};

// src/modules/auth/auth.controller.ts
var loginUser = async (req, res) => {
  try {
    const result = await authService.loginUserIntoDB(req.body);
    const { refreshToken: refreshToken2 } = result;
    res.cookie("refreshToken", refreshToken2, {
      secure: false,
      // in production => True
      httpOnly: true,
      // http true kore dile javascript diye access kora jabe nah
      sameSite: "lax"
    });
    res.status(200).json({
      success: true,
      message: "User Login successfully!",
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      error
    });
  }
};
var refreshToken = async (req, res) => {
  try {
    const result = await authService.generateRefreshToken(
      req.cookies.refreshToken
    );
    res.status(200).json({
      success: true,
      message: "Access token generated!",
      data: result
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message, error });
  }
};
var authController = {
  loginUser,
  refreshToken
};

// src/modules/auth/auth.route.ts
var router3 = (0, import_express3.Router)();
router3.post("/login", authController.loginUser);
router3.post("/refresh-token", authController.refreshToken);
var authRoute = router3;

// src/middleware/logger.ts
var import_fs = __toESM(require("fs"), 1);
var logger = (req, res, next) => {
  console.log("Method - URL - Time:", req.method, req.url, Date.now());
  const log = `
Time   : ${(/* @__PURE__ */ new Date()).toISOString()}
Method : ${req.method}
URL    : ${req.url}
--------------------------------
`;
  import_fs.default.appendFile("logger.text", log, (err) => {
  });
  next();
};
var logger_default = logger;

// src/app.ts
var import_cookie_parser = __toESM(require("cookie-parser"), 1);
var import_cors = __toESM(require("cors"), 1);

// src/middleware/globalErrorHandler.ts
var globalErrorHandler = (err, req, res, next) => {
  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error"
  });
};
var globalErrorHandler_default = globalErrorHandler;

// src/app.ts
var app = (0, import_express4.default)();
app.use((0, import_cookie_parser.default)());
app.use(import_express4.default.json());
app.use(import_express4.default.text());
app.use(import_express4.default.urlencoded({ extended: true }));
app.use(logger_default);
app.use(
  (0, import_cors.default)({
    origin: "http://localhost:3000"
  })
);
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Express Server!",
    author: "Subro"
  });
});
app.use("/api/users", userRoute);
app.use("/api/profile", profileRoute);
app.use("/api/auth", authRoute);
app.use(globalErrorHandler_default);
var app_default = app;

// src/server.ts
var main = () => {
  initDB();
  app_default.listen(config_default.port, () => {
    console.log(`Example app listening on port ${config_default.port}`);
  });
};
main();
//# sourceMappingURL=server.cjs.map