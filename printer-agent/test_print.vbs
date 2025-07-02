Set ObjDoc = CreateObject("bpac.Document")
bRet = ObjDoc.Open("M.lbx")
If (bRet <> False) Then
    ObjDoc.GetObject("assetName").Text = "Test Asset"
    ObjDoc.GetObject("hospitalName").Text = "SMH"
    ObjDoc.GetObject("qrCode").Text = "TEST123"
    ObjDoc.GetObject("assetSerialNumber").Text = "SER001"
    ObjDoc.StartPrint "TestBatch", bpoHalfCut
    ObjDoc.PrintOut 1, bpoHalfCut
    ObjDoc.PrintOut 1, bpoHalfCut
    ObjDoc.PrintOut 1, bpoHalfCut
    ObjDoc.EndPrint
    ObjDoc.Close
End If
Set ObjDoc = Nothing
