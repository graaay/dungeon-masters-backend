import App from './app/index';

const port = 9090;

App.listen(port, "localhost", () => console.log(`Server is running on port ${port}`));
