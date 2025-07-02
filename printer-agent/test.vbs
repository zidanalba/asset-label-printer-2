Set objDoc = CreateObject("bpac.Document")
bRet = objDoc.Open("C:\Path\To\YourLabel.lbx")
If (bRet) Then
    objDoc.GetObject("assetName").Text = "Label 1"
    objDoc.StartPrint "TestPrint", bpoHalfCut
    objDoc.PrintOut 1, bpoHalfCut

    objDoc.GetObject("assetName").Text = "Label 2"
    objDoc.PrintOut 1, bpoHalfCut

    objGet = objDoc.GetPrinterSetting
    WScript.Echo "HalfCut Supported: " & objGet.IsHalfCutSupported

    objDoc.EndPrint
    objDoc.Close
End If
Set objDoc = Nothing
