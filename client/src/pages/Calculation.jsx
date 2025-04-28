import React, { useState } from "react";
import { Card, CardContent } from "../components/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/tabls";
import { Input } from "../components/input";
import { Label } from "../components/label";
import { Button } from "../components/Cbutton";
import { FiInfo, FiCopy, FiDownload, FiShare2 } from "react-icons/fi";
import { Tooltip } from "../components/tooltip";
import { Badge } from "../components/badge";

const gearWheels = [24, 24, 28, 32, 36, 40, 44, 48, 56, 64, 72, 86, 100];

const GearCalculationUI = () => {
  // State management
  const [activeTab, setActiveTab] = useState("spur");
  const [spurTeeth, setSpurTeeth] = useState('');
  const [spurModule, setSpurModule] = useState('');
  const [spurResult, setSpurResult] = useState(null);
  const [helicalTeeth, setHelicalTee] = useState("");
  const [helicalModul, setHelicalModul] = useState("");
  const [helixAngle, setHelixAngle] = useState('');
  const [gearRatio, setGearRatio] = useState('');
  const [z2Input, setZ2Input] = useState('');
  const [helicalResult, setHelicalResult] = useState(null);
  const [requiredRatio, setRequiredRatio] = useState(1.0);
  const [extraGear, setExtraGear] = useState(15);
  const [tolerance, setTolerance] = useState(0.01);
  const [matches, setMatches] = useState([]);
  const [bevelZ, setBevelZ] = useState('');
  const [bevelModule, setBevelModule] = useState('');
  const [BgearRatio, BsetGearRatio] = useState('');
  const [bevelZ2, setBevelZ2] = useState('');
  const [bevelResult, setBevelResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Utility functions
  const degToRad = (angle) => angle * (Math.PI / 180);
  const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
  
  const reduceRatio = (a, b) => {
    const divisor = gcd(a, b);
    return `${a / divisor}:${b / divisor}`;
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Calculation functions
  const calculateSpurGear = () => {
    setIsLoading(true);
    setTimeout(() => {
      const teeth = parseFloat(spurTeeth);
      const module = parseFloat(spurModule);

      if (!isNaN(teeth) && !isNaN(module)) {
        const pd = module * Math.PI;
        const od = module * (teeth + 2);
        const h = (13 / 6) * module;
        const id = od - (2 * h);
        const c = (1 / 6) * module;
        const D = (7 / 6) * module;
        const B = module * 10;

        setSpurResult({
          od: od.toFixed(2),
          pd: pd.toFixed(2),
          h: h.toFixed(2),
          id: id.toFixed(2),
          c: c.toFixed(2),
          D: D.toFixed(2),
          B: B.toFixed(2)
        });
      } else {
        setSpurResult("Invalid input");
      }
      setIsLoading(false);
    }, 500);
  };

  const calculateHelicalgear = () => {
    setIsLoading(true);
    setTimeout(() => {
      const z1 = parseFloat(helicalTeeth);
      const m = parseFloat(helicalModul);
      const betaDeg = parseFloat(helixAngle);
      const beta = degToRad(betaDeg);
      const ratioInput = gearRatio.trim();
      const z2Manual = parseFloat(z2Input);

      if (!isNaN(z1) && !isNaN(m) && !isNaN(beta)) {
        const sm = m / Math.cos(beta);
        const pd1 = z1 * sm;
        const od1 = pd1 + 2 * m;
        const ncp = m * Math.PI;
        const lead = (pd1 * Math.PI) / Math.tan(beta);
        const cosBeta = Math.cos(beta);
        const nr = z1 / Math.pow(cosBeta, 3);
        const h = (13 / 6) * m;

        let z2 = null;
        let pd2 = null;
        let od2 = null;
        let computedRatio = null;

        if (!isNaN(z2Manual) && z2Manual > 0) {
          z2 = z2Manual;
          pd2 = z2 * sm;
          od2 = pd2 + 2 * m; 
          computedRatio = reduceRatio(z1, z2);
        } else if (ratioInput.includes(":")) {
          const [n, d] = ratioInput.split(":").map(Number);
          if (!isNaN(n) && !isNaN(d) && d !== 0) {
            z2 = (z1 * d) / n;
            pd2 = z2 * sm;
            od2 = pd2 + 2 * m; 
            computedRatio = reduceRatio(z1, z2);
          }
        }

        setHelicalResult({
          pd: pd1.toFixed(2),
          od: od1.toFixed(2),
          sm: sm.toFixed(4),
          ncp: ncp.toFixed(2),
          lead: lead.toFixed(2),
          nr: nr.toFixed(2),
          h: h.toFixed(2),
          pd2: pd2 ? pd2.toFixed(2) : "-",
          z2: z2 ? z2.toFixed(0) : "-",
          od2: od2 ? od2.toFixed(2) : "-",
          computedRatio: computedRatio || "-"
        });
      } else {
        setHelicalResult("Invalid input");
      }
      setIsLoading(false);
    }, 500);
  };

  const calculateBevelGear = () => {
    setIsLoading(true);
    setTimeout(() => {
      const z1 = parseFloat(bevelZ);
      const m = parseFloat(bevelModule);
      const ratioInput = BgearRatio.trim();
      const z2Manual = parseFloat(bevelZ2);
    
      if (!isNaN(z1) && !isNaN(m)) {
        let z2 = null;
        
        if (!isNaN(z2Manual) && z2Manual > 0) {
          z2 = z2Manual;
        } else if (ratioInput.includes(":")) {
          const [n, d] = ratioInput.split(":").map(Number);
          if (!isNaN(n) && !isNaN(d) && d !== 0) {
            z2 = (z1 * d) / n;
          }
        }
    
        const PD = m * z1;
        const θ = Math.atan(z1 / (z2 || 1)) * (180/Math.PI);
        const β = PD / (6 * Math.sin(degToRad(θ)));
        const τβ = (1.167 * 2 * Math.sin(degToRad(θ))) / z1;
        const α_prime = 8 - θ;
        const OD = PD + 2 * m * Math.cos(degToRad(θ));
        const r_prime = 8 - β;
    
        setBevelResult({
          pitchDiameter: PD.toFixed(2),
          outerDiameter: OD.toFixed(2),
          pitchAngle: θ.toFixed(2),
          toothAngle: β.toFixed(2),
          pressureAngleCorrection: α_prime.toFixed(2),
          toothThicknessFactor: τβ.toFixed(4),
          rootAngle: r_prime.toFixed(2),
          calculatedZ2: z2 ? z2.toFixed(0) : "N/A",
          BgearRatio: z2 ? `${z1}:${z2}` : "N/A"
        });
      } else {
        setBevelResult("Invalid input");
      }
      setIsLoading(false);
    }, 500);
  };

  const findGearCombinations = () => {
    setIsLoading(true);
    setTimeout(() => {
      const results = [];
      for (let i = 0; i < gearWheels.length; i++) {
        for (let j = 0; j < gearWheels.length; j++) {
          for (let k = 0; k < gearWheels.length; k++) {
            for (let l = 0; l < gearWheels.length; l++) {
              const z1 = gearWheels[i];
              const z2 = gearWheels[j];
              const z3 = gearWheels[k];
              const z4 = gearWheels[l];
              const ratio = (z1 * z2) / (z3 * z4);
              if (Math.abs(ratio - requiredRatio) <= tolerance) {
                const fit1 = z1 + z2 > z3 + extraGear;
                const fit2 = z3 + z4 > z2 + extraGear;
                if (fit1 && fit2) {
                  results.push({ z1, z2, z3, z4, ratio });
                }
              }
            }
          }
        }
      }
      setMatches(results);
      setIsLoading(false);
    }, 500);
  };

  const renderResultCard = (title, data) => (
    <Card className="mt-4">
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-xl font-semibold">{title}</h3>
          <div className="flex gap-2">
            <Tooltip content="Copy results">
              <button 
                onClick={() => copyToClipboard(JSON.stringify(data, null, 2))}
                className="p-2 hover:bg-gray-100 rounded"
              >
                <FiCopy className="text-gray-600" />
              </button>
            </Tooltip>
            <Tooltip content="Export as PDF">
              <button className="p-2 hover:bg-gray-100 rounded">
                <FiDownload className="text-gray-600" />
              </button>
            </Tooltip>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(data).map(([key, value]) => (
            <div key={key} className="flex items-center">
              <span className="font-medium text-gray-700 w-40">{key}:</span>
              <Badge variant="outline" className="ml-2">
                {value}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gear Calculation Tool</h1>
        <div className="flex gap-2">
          <Button variant="outline">
            <FiShare2 className="mr-2" />
            Share
          </Button>
          <Button variant="outline">
            <FiInfo className="mr-2" />
            Documentation
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-5 mb-6">
          <TabsTrigger value="spur">Spur Gear</TabsTrigger>
          <TabsTrigger value="helical">Helical Gear</TabsTrigger>
          <TabsTrigger value="bevel">Bevel Gear</TabsTrigger>
          <TabsTrigger value="worm">Worm Gear</TabsTrigger>
          <TabsTrigger value="differential">Differential Indexing</TabsTrigger>
        </TabsList>

        <TabsContent value="spur">
          <Card>
            <CardContent className="grid gap-4 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label>Number of Teeth</Label>
                  <Input 
                    type="number" 
                    value={spurTeeth} 
                    onChange={(e) => setSpurTeeth(e.target.value)} 
                    placeholder="e.g. 20" 
                  />
                </div>
                <div>
                  <Label>Module</Label>
                  <Input 
                    type="number" 
                    value={spurModule} 
                    onChange={(e) => setSpurModule(e.target.value)} 
                    placeholder="e.g. 2.5" 
                  />
                </div>
              </div>
              <Button 
                className="mt-4" 
                onClick={calculateSpurGear}
                disabled={isLoading}
              >
                {isLoading ? "Calculating..." : "Calculate Spur Gear"}
              </Button>
              {spurResult && typeof spurResult === 'object' && renderResultCard("Spur Gear Results", spurResult)}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="helical">
          <Card>
            <CardContent className="grid gap-4 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label>Number of Teeth (Z₁)</Label>
                  <Input 
                    type="number" 
                    value={helicalTeeth} 
                    onChange={(e) => setHelicalTee(e.target.value)} 
                    placeholder="e.g. 80" 
                  />
                </div>
                <div>
                  <Label>Module</Label>
                  <Input 
                    type="number" 
                    value={helicalModul} 
                    onChange={(e) => setHelicalModul(e.target.value)} 
                    placeholder="e.g. 2" 
                  />
                </div>
                <div>
                  <Label>Helix Angle (°)</Label>
                  <Input 
                    type="number" 
                    value={helixAngle} 
                    onChange={(e) => setHelixAngle(e.target.value)} 
                    placeholder="e.g. 27" 
                  />
                </div>
                <div>
                  <Label>Gear Ratio (e.g. 5:4)</Label>
                  <Input 
                    type="text" 
                    value={gearRatio} 
                    onChange={(e) => setGearRatio(e.target.value)} 
                    placeholder="e.g. 5:4" 
                  />
                </div>
                <div>
                  <Label>or Manually Enter Z₂</Label>
                  <Input 
                    type="number" 
                    value={z2Input} 
                    onChange={(e) => setZ2Input(e.target.value)} 
                    placeholder="e.g. 64" 
                  />
                </div>
              </div>
              <Button 
                className="mt-4" 
                onClick={calculateHelicalgear}
                disabled={isLoading}
              >
                {isLoading ? "Calculating..." : "Calculate Helical Gear"}
              </Button>
              {helicalResult && typeof helicalResult === 'object' && renderResultCard("Helical Gear Results", helicalResult)}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bevel">
          <Card>
            <CardContent className="grid gap-4 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label>Number of Teeth (Z₁)</Label>
                  <Input 
                    type="number" 
                    value={bevelZ} 
                    onChange={(e) => setBevelZ(e.target.value)} 
                    placeholder="e.g. 20" 
                  />
                </div>
                <div>
                  <Label>Module (M)</Label>
                  <Input 
                    type="number" 
                    value={bevelModule} 
                    onChange={(e) => setBevelModule(e.target.value)} 
                    placeholder="e.g. 2.5" 
                  />
                </div>
                <div>
                  <Label>Gear Ratio (e.g. 2:1)</Label>
                  <Input 
                    type="text" 
                    value={BgearRatio} 
                    onChange={(e) => BsetGearRatio(e.target.value)} 
                    placeholder="e.g. 2:1" 
                  />
                </div>
                <div>
                  <Label>OR Manually Enter Z₂ (Optional)</Label>
                  <Input 
                    type="number" 
                    value={bevelZ2} 
                    onChange={(e) => setBevelZ2(e.target.value)} 
                    placeholder="e.g. 40" 
                  />
                </div>
              </div>
              <Button 
                className="mt-4" 
                onClick={calculateBevelGear}
                disabled={isLoading}
              >
                {isLoading ? "Calculating..." : "Calculate Bevel Gear"}
              </Button>
              {bevelResult && typeof bevelResult === 'object' && renderResultCard("Bevel Gear Results", bevelResult)}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="differential">
          <Card>
            <CardContent className="grid gap-4 p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <Label>Required Ratio</Label>
                  <Input 
                    type="number" 
                    step="0.001" 
                    value={requiredRatio} 
                    onChange={(e) => setRequiredRatio(parseFloat(e.target.value))} 
                  />
                </div>
                <div>
                  <Label>Extra Gear Teeth</Label>
                  <Input 
                    type="number" 
                    value={extraGear} 
                    onChange={(e) => setExtraGear(parseInt(e.target.value))} 
                  />
                </div>
                <div>
                  <Label>Tolerance</Label>
                  <Input 
                    type="number" 
                    step="0.001" 
                    value={tolerance} 
                    onChange={(e) => setTolerance(parseFloat(e.target.value))} 
                  />
                </div>
              </div>
              <Button 
                className="mt-4" 
                onClick={findGearCombinations}
                disabled={isLoading}
              >
                {isLoading ? "Searching..." : "Find Gear Sets"}
              </Button>
              
              {matches.length > 0 && (
                <Card className="mt-4">
                  <CardContent className="p-4">
                    <h3 className="text-xl font-semibold mb-3">Matching Gear Combinations</h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Z1</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Z2</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Z3</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Z4</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ratio</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {matches.slice(0, 10).map((set, index) => (
                            <tr key={index}>
                              <td className="px-6 py-4 whitespace-nowrap">{set.z1}</td>
                              <td className="px-6 py-4 whitespace-nowrap">{set.z2}</td>
                              <td className="px-6 py-4 whitespace-nowrap">{set.z3}</td>
                              <td className="px-6 py-4 whitespace-nowrap">{set.z4}</td>
                              <td className="px-6 py-4 whitespace-nowrap">{set.ratio.toFixed(4)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {matches.length > 10 && (
                      <div className="mt-2 text-sm text-gray-500">
                        Showing 10 of {matches.length} matches
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GearCalculationUI;