# Zip Helper

A simple script to create a zip archive of a specified folder while respecting `.gitignore` rules. This tool is useful for packaging projects for deployment or backup without including unnecessary files.

## Features

- Compress a specified folder into a `.zip` file.
- Automatically respects rules defined in `.gitignore`.
- Outputs the zip file to a designated `results` directory.

## Requirements

- Node.js
- npm

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/dante4rt/zip-helper.git
   cd zip-helper
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

## Usage

Run the script from the terminal, providing the path to the folder you want to zip:

```bash
npm start /path/to/your/folder
```

The zipped file will be created in the `results` directory within the script's location.

## Example

```bash
npm start ./my-project
```

This command will create `my-project.zip` in the `results` folder, excluding files and directories specified in `.gitignore`.

## Contributing

Feel free to submit pull requests or issues. Contributions are welcome!

## License

This project is licensed under the MIT License.
