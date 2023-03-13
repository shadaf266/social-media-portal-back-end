declare global {
    namespace NodeJS {
      interface ProcessEnv {
        LINKEDIN_AUTH_TOKEN: string;
        LINKEDIN_CLIENT_ID: string;
        LINKEDIN_CLIENT_SECRET: string;
        LINKEDIN_SCOPE: string;
        LINKEDIN_REDIRECT_URI: string;
        LINKEDIN_SECRET_CODE: string;
        val:string;
        NODE_ENV: 'development' | 'production';
        PORT?: number;
        PWD: string;
      }
    }
  }
  
  // If this file has no import/export statements (i.e. is a script)
  // convert it into a module by adding an empty export statement.
  export {}