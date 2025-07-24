# Brother Label Printer Integration – Laravel + Express Agent
This repository contains an example implementation of label printing using a Brother P-touch PT-P950NW printer with a Laravel Web App and a Node.js-based printer agent that acts as a middleware to communicate with the printer via VBScript and b-PAC SDK.

## Project Structure
```
/app              → Laravel Web App
  - Sends HTTP request to printer agent

/printer-agent               → Express.js app as print middleware
  /resources
    - S.lbx                 → Label template file for small size
    - M.lbx                 → Template file for medium size
    - L.lbx                 → Template file for large size
    - print.vbs             → Script executed to print label
```

## How it works
1. The Laravel Web App sends a POST request to the Printer Agent with label information (like asset name, serial number, unit, and size).

2. The Printer Agent receives the data and:
   - Writes a temporary VBScript (print.vbs) based on the input.
   - Executes it using cscript.
   - The VBScript uses the Brother b-PAC SDK to open the .lbx layout file and prints the label via USB.

## Requirements
- Brother P-touch PT-P950NW printer
- Brother b-PAC SDK installed on Windows, [Download here](https://support.brother.com/g/s/es/dev/en/bpac/download/index.html?c=eu_ot&lang=en&navi=offall&comple=on&redirect=on ).
- Windows OS
- Node.js installed (for the printer-agent)
- Laravel Web App (or any backend that can send HTTP POST)

## Getting Started
Set Up Printer Agent
   ```bash
   cd printer-agent
   npm install
   node index.js
   ```

## API Documentation
Request Example
```json
{
  "size": "S",           // S, M, or L
  "assets": [
    {
      "assetCode": "A123",
      "assetName": "Infusion Pump",
      "assetSerialNumber": "SN-00112233"
    }
  ]
}
```

## Notes
To handle the excessive use of the label's paper you should include the code '528' (See in the [index.js](https://github.com/zidanalba/asset-label-printer-2/blob/main/printer-agent/index.js)).
