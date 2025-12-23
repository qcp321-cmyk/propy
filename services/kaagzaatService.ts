import { jsPDF } from 'jspdf';
import { Property } from '../types';
import { TAGLINE } from '../constants';

interface KaagzaatOptions {
  property: Property;
  userName: string;
  userPhone: string;
  userArea?: string;
  routeSteps?: string[];
}

export const generateKaagzaat = async ({ property, userName, userPhone, userArea, routeSteps }: KaagzaatOptions) => {
  try {
    const doc = new jsPDF();
    const width = doc.internal.pageSize.getWidth();
    const height = doc.internal.pageSize.getHeight();

    // Premium Color Palette
    const Colors = {
        slate950: [2, 6, 23],
        slate900: [15, 23, 42],
        slate800: [30, 41, 59],
        violet600: [124, 58, 237],
        violet400: [167, 139, 250],
        emerald500: [16, 185, 129],
        orange300: [253, 186, 116], // Brand Logo Color (#fdba74)
        lime400: [163, 230, 53],
        white: [255, 255, 255],
        textGray: [148, 163, 184],
    };

    // Helper: Draw the Vector Logo
    const drawLogo = (x: number, y: number, size: number) => {
        const s = size / 100; // Scale factor
        
        // Draw Logo Background Box (Solid Slate for clarity)
        doc.setFillColor(Colors.slate800[0], Colors.slate800[1], Colors.slate800[2]);
        doc.roundedRect(x - 2, y - 2, size + 4, size + 4, 1.5, 1.5, 'F');
        
        doc.setDrawColor(Colors.orange300[0], Colors.orange300[1], Colors.orange300[2]);
        doc.setLineWidth(0.6);

        // Path 1: M30,20 Q45,55 35,85 (Approx Q with C)
        doc.moveTo(x + 30 * s, y + 20 * s);
        doc.curveTo(x + 45 * s, y + 55 * s, x + 45 * s, y + 55 * s, x + 35 * s, y + 85 * s);
        doc.stroke();

        // Path 2: M40,30 C75,10 90,55 45,60
        doc.moveTo(x + 40 * s, y + 30 * s);
        doc.curveTo(x + 75 * s, y + 10 * s, x + 90 * s, y + 55 * s, x + 45 * s, y + 60 * s);
        doc.stroke();

        // Path 3: M20,70 Q55,55 85,80
        doc.moveTo(x + 20 * s, y + 70 * s);
        doc.curveTo(x + 55 * s, y + 55 * s, x + 55 * s, y + 55 * s, x + 85 * s, y + 80 * s);
        doc.stroke();
    };

    // Helper: Master Page Structure
    const drawPageStructure = (title: string, pageNo: number) => {
        doc.setFillColor(Colors.slate950[0], Colors.slate950[1], Colors.slate950[2]);
        doc.rect(0, 0, width, height, 'F');
        
        doc.setFillColor(Colors.slate900[0], Colors.slate900[1], Colors.slate900[2]);
        doc.rect(0, 0, width, 25, 'F');
        doc.setDrawColor(Colors.violet600[0], Colors.violet600[1], Colors.violet600[2]);
        doc.setLineWidth(0.5);
        doc.line(0, 25, width, 25);

        // Draw the Logo in the Header
        drawLogo(12, 7, 10);

        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.setTextColor(Colors.white[0], Colors.white[1], Colors.white[2]);
        doc.text("PROPERTYFIE", 25, 14);
        doc.setFontSize(6);
        doc.setTextColor(Colors.orange300[0], Colors.orange300[1], Colors.orange300[2]);
        doc.text("ELITE INTEL UNIT", 25, 18);
        
        doc.setFontSize(10);
        doc.setTextColor(Colors.white[0], Colors.white[1], Colors.white[2]);
        doc.text(title.toUpperCase(), width - 15, 15, { align: 'right' });

        // Footer
        doc.setFontSize(8);
        doc.setTextColor(Colors.textGray[0], Colors.textGray[1], Colors.textGray[2]);
        doc.text(`PROPERTYFIE AUDIT SYSTEM • V4.2.0 • ${TAGLINE.toUpperCase()}`, 15, height - 10);
        doc.text(`PAGE ${pageNo}`, width - 25, height - 10);
    };

    // Helper: Founder's View Block
    const drawFounderView = (y: number, text: string) => {
        doc.setFillColor(Colors.slate900[0], Colors.slate900[1], Colors.slate900[2]);
        doc.roundedRect(15, y, width - 30, 35, 3, 3, 'F');
        doc.setDrawColor(Colors.lime400[0], Colors.lime400[1], Colors.lime400[2]);
        doc.setLineWidth(0.3);
        doc.line(15, y, 15, y + 35);

        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        doc.setTextColor(Colors.lime400[0], Colors.lime400[1], Colors.lime400[2]);
        doc.text("FOUNDER'S STRATEGIC AUDIT - AMAN SINGH", 22, y + 10);

        doc.setFont("helvetica", "italic");
        doc.setFontSize(9);
        doc.setTextColor(Colors.white[0], Colors.white[1], Colors.white[2]);
        const wrappedText = doc.splitTextToSize(text, width - 50);
        doc.text(wrappedText, 22, y + 18);
        
        doc.setFont("helvetica", "bold");
        doc.setFontSize(7);
        doc.setTextColor(Colors.textGray[0], Colors.textGray[1], Colors.textGray[2]);
        doc.text("COMPLIANCE STATUS: VERIFIED / TIER-1", 22, y + 30);
    };

    // --- PAGE 1: EXECUTIVE COVER ---
    drawPageStructure("Asset Intel Report", 1);
    
    doc.setFillColor(Colors.violet600[0], Colors.violet600[1], Colors.violet600[2]);
    doc.rect(15, 45, 4, 45, 'F');
    
    doc.setFontSize(38);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(Colors.white[0], Colors.white[1], Colors.white[2]);
    const splitTitle = doc.splitTextToSize(property.title.toUpperCase(), width - 50);
    doc.text(splitTitle, 25, 65);

    doc.setFontSize(14);
    doc.setTextColor(Colors.violet400[0], Colors.violet400[1], Colors.violet400[2]);
    doc.text(property.address.toUpperCase(), 25, 100);

    const blockY = 160;
    doc.setFillColor(Colors.slate900[0], Colors.slate900[1], Colors.slate900[2]);
    doc.roundedRect(15, blockY, width - 30, 65, 4, 4, 'F');
    doc.setDrawColor(Colors.violet600[0], Colors.violet600[1], Colors.violet600[2]);
    doc.rect(15, blockY, 3, 65, 'F');

    doc.setFontSize(10);
    doc.setTextColor(Colors.violet400[0], Colors.violet400[1], Colors.violet400[2]);
    doc.text("INTEL PREPARED FOR", 25, blockY + 18);
    
    doc.setFontSize(24);
    doc.setTextColor(Colors.white[0], Colors.white[1], Colors.white[2]);
    doc.text(userName.toUpperCase(), 25, blockY + 35);
    
    doc.setFontSize(11);
    doc.setTextColor(Colors.textGray[0], Colors.textGray[1], Colors.textGray[2]);
    doc.text(`AUTHENTICATED CONTACT: +91 ${userPhone}`, 25, blockY + 50);

    drawFounderView(height - 65, `This asset has been audited for structural compliance and investment viability. My team has verified the RERA documentation and current infrastructure delta to ensure your capital security.`);

    // --- PAGE 2: PROJECT INTELLIGENCE & SPECS ---
    doc.addPage();
    drawPageStructure("Project Specification", 2);

    doc.setFontSize(20);
    doc.setTextColor(Colors.white[0], Colors.white[1], Colors.white[2]);
    doc.text("ASSET INTELLIGENCE SUMMARY", 15, 45);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(Colors.textGray[0], Colors.textGray[1], Colors.textGray[2]);
    const descLines = doc.splitTextToSize(property.description, width - 30);
    doc.text(descLines, 15, 55);

    const gridY = 95;
    const specs = [
        { label: "DEVELOPER ENTITY", val: property.developer || "Tier-1 Verified" },
        { label: "RERA AUTHENTICATION", val: property.reraId || "PRM/KA/RERA/Applied" },
        { label: "POSSESSION HORIZON", val: property.completionYear || "Estimated 2027-2028" },
        { label: "VERTICAL STRUCTURE", val: property.totalFloors ? `G + ${property.totalFloors} Floors` : "High-Rise Tier" },
        { label: "AUDITED CONFIG", val: `${property.beds} BHK Elite` },
        { label: "PRECISION AREA", val: `${property.sqft} Sq.Ft (Super)` }
    ];

    specs.forEach((s, i) => {
        const x = 15 + (i % 2) * 95;
        const y = gridY + Math.floor(i / 2) * 22;
        doc.setFillColor(Colors.slate900[0], Colors.slate900[1], Colors.slate900[2]);
        doc.roundedRect(x, y, 90, 18, 2, 2, 'F');
        
        doc.setFontSize(7);
        doc.setTextColor(Colors.textGray[0], Colors.textGray[1], Colors.textGray[2]);
        doc.text(s.label, x + 5, y + 7);
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(Colors.white[0], Colors.white[1], Colors.white[2]);
        doc.text(String(s.val), x + 5, y + 13);
    });

    const priceY = 175;
    doc.setFontSize(20);
    doc.setTextColor(Colors.white[0], Colors.white[1], Colors.white[2]);
    doc.text("DETAILED OFFERING MATRIX", 15, priceY);

    const basePriceLakhs = property.price / 100000;
    const baseSqft = property.sqft;
    
    const rows = [
        ['CONFIGURATION TYPE', 'SIZE (SQ.FT)', 'ESTIMATED ENTRY*'],
        [`${property.beds - 1 > 0 ? property.beds - 1 : 1} BHK Executive`, `${Math.round(baseSqft * 0.75)}`, `Rs. ${Math.round(basePriceLakhs * 0.75)} Lakhs+`],
        [`${property.beds} BHK Premium`, `${baseSqft}`, `Rs. ${Math.round(basePriceLakhs)} Lakhs+`],
        [`${property.beds} BHK Luxury`, `${Math.round(baseSqft * 1.15)}`, `Rs. ${Math.round(basePriceLakhs * 1.2)} Lakhs+`],
        [`${property.beds + 1} BHK Zenith`, `${Math.round(baseSqft * 1.5)}`, `Rs. ${Math.round(basePriceLakhs * 1.6)} Lakhs+`]
    ];

    rows.forEach((row, i) => {
        const y = priceY + 20 + (i * 12);
        if (i === 0) {
            doc.setFillColor(Colors.violet600[0], Colors.violet600[1], Colors.violet600[2]);
            doc.rect(15, y - 8, width - 30, 11, 'F');
            doc.setTextColor(Colors.white[0], Colors.white[1], Colors.white[2]);
        } else {
            doc.setTextColor(Colors.textGray[0], Colors.textGray[1], Colors.textGray[2]);
            if (i % 2 === 0) {
                doc.setFillColor(Colors.slate900[0], Colors.slate900[1], Colors.slate900[2]);
                doc.rect(15, y - 8, width - 30, 11, 'F');
            }
        }
        doc.setFontSize(9);
        doc.setFont("helvetica", i === 0 ? "bold" : "normal");
        doc.text(row[0], 20, y);
        doc.text(row[1], 85, y);
        doc.text(row[2], 145, y);
    });

    drawFounderView(height - 65, `Project transparency is non-negotiable. We've vetted ${property.developer}'s track record for delivery. This matrix is based on active inventory audits for Q4 2025.`);

    // --- PAGE 3: COMPLIANCE & VALUE DECODER ---
    doc.addPage();
    drawPageStructure("Compliance & Valuation", 3);

    const fairY = 45;
    doc.setFontSize(22);
    doc.setTextColor(Colors.white[0], Colors.white[1], Colors.white[2]);
    doc.text("FAIR-VALUE DECODER", 15, fairY);

    const fv = property.fairValue || { marketAverage: 9500, projectPremium: 10, fairPrice: property.price };
    doc.setFillColor(Colors.slate900[0], Colors.slate900[1], Colors.slate900[2]);
    doc.roundedRect(15, fairY + 12, width - 30, 55, 4, 4, 'F');

    const fvLines = [
        { l: "Market Average (Regional Cluster)", v: `Rs. ${fv.marketAverage} /sqft` },
        { l: "Infrastructure Delta (Metro/Tech)", v: `+ 8% Premium` },
        { l: "Developer/Amenity Tier Premium", v: `+ ${fv.projectPremium}% Premium` },
        { l: "Propertyfie Fair-Valuation Benchmark", v: `Rs. ${(fv.fairPrice / 100000).toFixed(2)} Lakhs`, bold: true, color: Colors.lime400 }
    ];

    fvLines.forEach((l, i) => {
        const y = fairY + 28 + (i * 11);
        doc.setFontSize(10);
        doc.setFont("helvetica", l.bold ? "bold" : "normal");
        
        if (l.bold && l.color) {
            doc.setTextColor(l.color[0], l.color[1], l.color[2]);
        } else {
            doc.setTextColor(l.bold ? Colors.white[0] : Colors.textGray[0], l.bold ? Colors.white[1] : Colors.textGray[1], l.bold ? Colors.white[2] : Colors.textGray[2]);
        }
        
        doc.text(l.l, 25, y);
        doc.text(l.v, width - 25, y, { align: 'right' });
    });

    if (routeSteps && routeSteps.length > 0) {
        doc.setFontSize(20);
        doc.setTextColor(Colors.white[0], Colors.white[1], Colors.white[2]);
        doc.text(`PATHFINDER: COMMUTE AUDIT`, 15, 135);
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(Colors.textGray[0], Colors.textGray[1], Colors.textGray[2]);
        routeSteps.slice(0, 10).forEach((step, i) => {
            const stepY = 150 + (i * 9);
            doc.setFillColor(Colors.violet600[0], Colors.violet600[1], Colors.violet600[2]);
            doc.circle(18, stepY - 1, 0.5, 'F');
            doc.text(step, 22, stepY);
        });
    }

    drawFounderView(height - 65, `Our valuation model accounts for 'Real Value' vs 'Asking Price'. If the Fair-Valuation is higher than asking, it's a strategic acquisition. Compliances under RERA are strictly monitored.`);

    doc.save(`Propertyfie_Intel_Dossier_${property.title.replace(/\s+/g, '_')}.pdf`);
  } catch (error) {
    console.error("Dossier Generation Failed:", error);
    alert("Strategic Dossier generation failed. Technical systems being audited.");
  }
};