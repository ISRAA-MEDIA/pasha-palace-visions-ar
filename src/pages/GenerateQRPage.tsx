
import { QRCodeSVG } from "qrcode.react";
import { useState, useRef } from "react";
import { VIDEOS_CONFIG } from "@/config/videos";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import ReactDOM from "react-dom";
import { generateExhibitQRData } from "@/utils/qrGenerator";

const GenerateQRPage = () => {
  const [selectedVideo, setSelectedVideo] = useState<string>("");

  const generateQRUrl = (videoId: string) => `v/${videoId}`;

  const handleCopyQRCode = (videoId: string) => {
    const qrUrl = generateQRUrl(videoId);
    navigator.clipboard.writeText(`${window.location.origin}/${qrUrl}`).then(() => {
      toast({
        title: "QR Code URL Copied",
        description: "The full QR code URL has been copied to clipboard.",
      });
    });
  };

  /**
   * Download all QRs as a single multi-page PDF ("exhibit0x.pdf"), each page
   * having the QR code and exhibit name below it.
   */
  const handleDownloadAllQRCodes = async () => {
    const exhibitEntries = Object.entries(VIDEOS_CONFIG).filter(
      ([, config]) => !!config.youtubeId // Only for configured exhibits
    );
    if (exhibitEntries.length === 0) {
      toast({
        title: "No QRs",
        description: "No exhibits are configured for PDF export.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "PDF Generating",
      description: "Generating a PDF, please wait...",
    });

    // PDF config (A4, portrait), margins for pretty layout
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: "a4",
    });

    // Prepare a hidden div to render QR+text for canvas snapshot
    const renderDiv = document.createElement("div");
    renderDiv.style.position = "fixed";
    renderDiv.style.left = "-9999px";
    document.body.appendChild(renderDiv);

    for (let i = 0; i < exhibitEntries.length; i++) {
      const [id] = exhibitEntries[i];
      // Compose QR code + label layout
      const pageDiv = document.createElement("div");
      pageDiv.style.width = "400px";
      pageDiv.style.height = "550px";
      pageDiv.style.display = "flex";
      pageDiv.style.flexDirection = "column";
      pageDiv.style.alignItems = "center";
      pageDiv.style.justifyContent = "center";
      pageDiv.style.background = "white";

      // Render QR code to virtual DOM
      const qrContainer = document.createElement("div");
      qrContainer.style.padding = "20px";
      qrContainer.style.background = "white";
      ReactDOM.render(
        <QRCodeSVG
          value={`${window.location.origin}/${generateQRUrl(id)}`}
          size={250}
          level="H"
          includeMargin={true}
        />,
        qrContainer
      );
      pageDiv.appendChild(qrContainer);

      // Label under QR
      const label = document.createElement("div");
      label.innerText = `Exhibit ${id.replace("exhibit", "").padStart(2, "0")}`;
      label.style.marginTop = "16px";
      label.style.fontSize = "18px";
      label.style.color = "#666";
      label.style.textAlign = "center";
      label.style.fontFamily = "'Playfair Display', serif";
      pageDiv.appendChild(label);

      // Clear div and put pageDiv inside
      renderDiv.innerHTML = "";
      renderDiv.appendChild(pageDiv);

      // Snapshot (canvas)
      // eslint-disable-next-line no-await-in-loop
      const canvas = await html2canvas(pageDiv, {
        scale: 2,
        backgroundColor: "#fff",
        useCORS: true,
      });
      const imgData = canvas.toDataURL("image/png");

      // Add image to PDF (centered)
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = 250 * 1.6; // 250px QR * scale factor
      const imgHeight = 320 * 1.4; // heuristic: covers QR + label
      const x = (pageWidth - imgWidth) / 2;
      const y = (pageHeight - imgHeight) / 2.5;

      if (i > 0) pdf.addPage();
      pdf.addImage(imgData, "PNG", x, y, imgWidth, imgHeight);

      // Clean up QR
      ReactDOM.unmountComponentAtNode(qrContainer);
    }
    // Clean up render div
    document.body.removeChild(renderDiv);

    // Save PDF with one label, regardless of which exhibits are present
    pdf.save("exhibits.pdf");
    toast({
      title: "Download Started",
      description: "Exported all QR codes as a single PDF.",
    });
  };

  return (
    <div className="min-h-screen bg-darkBg text-white p-6">
      <div className="max-w-md mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-playfair text-gold">Generate QR Codes</h1>
          <div className="flex gap-2 items-center">
            <Button onClick={handleDownloadAllQRCodes} variant="secondary">
              Download All QRs
            </Button>
            <Link to="/">
              <Button variant="outline">Back to Home</Button>
            </Link>
          </div>
        </div>
        <div className="space-y-8">
          <div className="grid gap-4">
            {Object.entries(VIDEOS_CONFIG).map(([id, config]) => (
              <div
                key={id}
                className={`p-4 rounded-lg text-left transition-all flex justify-between items-center ${
                  selectedVideo === id
                    ? "bg-gold/20 border border-gold"
                    : "bg-black/30 hover:bg-black/50"
                }`}
              >
                <div onClick={() => setSelectedVideo(id)} className="cursor-pointer flex-grow">
                  <h3 className="font-playfair text-lg mb-1">{`Exhibit: ${id}`}</h3>
                  <p className="text-sm text-gray-400">{`QR code for exhibit ${id}`}</p>
                </div>
                {selectedVideo === id && (
                  <Button variant="secondary" size="sm" onClick={() => handleCopyQRCode(id)}>
                    Copy QR URL
                  </Button>
                )}
              </div>
            ))}
          </div>
          {selectedVideo && (
            <div className="bg-black/30 p-6 rounded-lg flex flex-col items-center">
              <h2 className="text-xl font-playfair mb-4 text-gold">
                QR Code for {`Exhibit: ${selectedVideo}`}
              </h2>
              <div className="bg-white p-2 rounded-lg inline-block w-40 h-40 flex items-center justify-center">
                <QRCodeSVG
                  value={`${window.location.origin}/${generateQRUrl(selectedVideo)}`}
                  size={128}
                  level="H"
                  includeMargin={false}
                />
              </div>
              <p className="mt-4 text-sm text-gray-400 text-center">Scan this QR code to view the video</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GenerateQRPage;
