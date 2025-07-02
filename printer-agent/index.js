const express = require('express');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const app = express();
const PORT = 3001;

app.use(express.json());

// Helper to fill VBS template
function fillVbsTemplate(template, replacements) {
    return template.replace(/\{\{(\w+)\}\}/g, (_, key) => replacements[key] || '');
}

function escapeVbs(str) {
    return (str || '').replace(/"/g, '""');
}

function generateBatchVbsFile(lbxPath, assets, outputPath) {
    const vbsLines = [
        `Set ObjDoc = CreateObject("bpac.Document")`,
        `bRet = ObjDoc.Open("${lbxPath.replace(/\\/g, "\\\\")}")`,
        `If (bRet <> False) Then`,
        `    ObjDoc.StartPrint "BatchPrint", 528`
    ];

    assets.forEach(asset => {
        const name = escapeVbs(asset.assetName || '');
        const hospital = escapeVbs('SMH CIBINONG');
        const code = escapeVbs(asset.assetCode || '');
        let serial = asset.assetSerialNumber || '-';
        if (serial.length > 16) serial = serial.substring(0, 16);
        serial = escapeVbs(serial);

        vbsLines.push(
            `    ObjDoc.GetObject("assetName").Text = "${name}"`,
            `    ObjDoc.GetObject("hospitalName").Text = "${hospital}"`,
            `    ObjDoc.GetObject("qrCode").Text = "${code}"`,
            `    ObjDoc.GetObject("assetSerialNumber").Text = "${serial}"`,
            `    ObjDoc.PrintOut 1, 528`,
            ``
        );
    });

    vbsLines.push(
        `    ObjDoc.EndPrint`,
        `    ObjDoc.Close`,
        `End If`,
        `Set ObjDoc = Nothing`
    );

    fs.writeFileSync(outputPath, vbsLines.join('\r\n'));
}

app.post('/print', (req, res) => {
    const { size, assets } = req.body;

    console.log('request:', req.body.assets);

    if (!Array.isArray(assets) || assets.length === 0) {
        return res.status(400).json({ error: 'No assets provided.' });
    }

    if (!size || !['S', 'M', 'L'].includes(size)) {
        return res.status(400).json({ error: 'Invalid or missing size.' });
    }

    const lbxFileMap = { S: 'S.lbx', M: 'M.lbx', L: 'L.lbx' };
    const lbxPath = path.join(__dirname, lbxFileMap[size]);

    const tempVbsPath = path.join(__dirname, `print_batch_${Date.now()}.vbs`);

    try {
        generateBatchVbsFile(lbxPath, assets, tempVbsPath);

        const command = `cscript //nologo "${tempVbsPath}"`;
        console.log('Running:', command);

        exec(command, (error, stdout, stderr) => {
            fs.unlinkSync(tempVbsPath); // Clean up VBS file
            if (error) {
                console.error('Error:', stderr || error.message);
                return res.status(500).json({
                    results: assets.map(a => ({
                        success: false,
                        error: stderr || error.message,
                        asset: a
                    }))
                });
            }

            console.log('stdout:', stdout);
            res.json({
                results: assets.map(a => ({
                    success: true,
                    output: stdout,
                    asset: a
                }))
            });
        });

    } catch (err) {
        console.error('VBS generation error:', err);
        return res.status(500).json({ error: 'Failed to generate VBS script.' });
    }
});

app.listen(PORT, () => {
    console.log(`Printer agent listening on port ${PORT}`);
}); 