import React, { useState } from "react";
import { Card, CardContent } from "../components/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/tabls";
import { Input } from "../components/input";
import { Label } from "../components/label";
import { Button } from "../components/Cbutton";

const gearWheels = [24, 24, 28, 32, 36, 40, 44, 48, 56, 64, 72, 86, 100];

const GearCalculationUI = () => {
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

  const degToRad = (angle) => angle * (Math.PI / 180);

  const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
const reduceRatio = (a, b) => {
  const divisor = gcd(a, b);
  return `${a / divisor}:${b / divisor}`;
};


  const calculateSpurGear = () => {
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
  };

  const calculateHelicalgear = () => {
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
      let computedRatio = null;

      if (!isNaN(z2Manual) && z2Manual > 0) {
        z2 = z2Manual;
        computedRatio = reduceRatio(z1, z2);
      } else if (ratioInput.includes(":")) {
        const [n, d] = ratioInput.split(":" ).map(Number);
        if (!isNaN(n) && !isNaN(d) && d !== 0) {
          z2 = (z1 * d) / n;
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
        z2: z2 ? z2.toFixed(0) : "-",
        computedRatio: computedRatio || "-"
      });
    } else {
      setHelicalResult("Invalid input");
    }
  };
  const findGearCombinations = () => {
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
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Gear Calculation Tool</h1>
      <Tabs defaultValue="spur" className="w-full">
        <TabsList className="grid grid-cols-5 mb-4">
          <TabsTrigger value="spur">Spur Gear</TabsTrigger>
          <TabsTrigger value="helical">Helical Gear</TabsTrigger>
          <TabsTrigger value="bevel">Bevel Gear</TabsTrigger>
          <TabsTrigger value="worm">Worm Gear</TabsTrigger>
          <TabsTrigger value="differential">Differential Indexing</TabsTrigger>
        </TabsList>

        <TabsContent value="spur">
          <Card>
            <CardContent className="grid gap-4 p-4">
              <Label>Number of Teeth</Label>
              <Input type="number" value={spurTeeth} onChange={(e) => setSpurTeeth(e.target.value)} placeholder="e.g. 20" />
              <Label>Module</Label>
              <Input type="number" value={spurModule} onChange={(e) => setSpurModule(e.target.value)} placeholder="e.g. 2.5" />
              <Button className="mt-4" onClick={calculateSpurGear}>Calculate Spur Gear</Button>
              {spurResult !== null && typeof spurResult === 'object' && (
                <div className="mt-4 text-lg">
                  <strong>OUTER DIAMETER :</strong> {spurResult.od}<br />
                  <strong>PITCH CIRCLE DIAMETER :</strong> {spurResult.pd}<br />
                  <strong>INSIDE DIAMETER :</strong> {spurResult.id}<br />
                  <strong>HEIGHT :</strong> {spurResult.h}<br />
                  <strong>CLEARANCE :</strong> {spurResult.c}<br />
                  <strong>DIDEMDAM :</strong> {spurResult.D}<br />
                  <strong>BREADTH :</strong> {spurResult.B}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="helical">
        <Card>
            <CardContent className="grid gap-4 p-4">
              <Label>Number of Teeth (Z₁)</Label>
              <Input type="number" value={helicalTeeth} onChange={(e) => setHelicalTee(e.target.value)} placeholder="e.g. 80" />
              <Label>Module</Label>
              <Input type="number" value={helicalModul} onChange={(e) => setHelicalModul(e.target.value)} placeholder="e.g. 2" />
              <Label>Helix Angle (°)</Label>
              <Input type="number" value={helixAngle} onChange={(e) => setHelixAngle(e.target.value)} placeholder="e.g. 27" />
              <Label>Gear Ratio (e.g. 5:4)</Label>
              <Input type="text" value={gearRatio} onChange={(e) => setGearRatio(e.target.value)} placeholder="e.g. 5:4" />
              <Label>or Manually Enter Z₂</Label>
              <Input type="number" value={z2Input} onChange={(e) => setZ2Input(e.target.value)} placeholder="e.g. 64" />
              <Button className="mt-4" onClick={calculateHelicalgear}>Calculate Helical Gear</Button>
              {helicalResult && typeof helicalResult === 'object' && (
                <div className="mt-4 text-lg">
                  <div><strong>Transverse Module (sm):</strong> {helicalResult.sm}</div>
                  <div><strong>Pitch Diameter (pd):</strong> {helicalResult.pd}</div>
                  <div><strong>Outside Diameter (od):</strong> {helicalResult.od}</div>
                  <div><strong>Normal Circular Pitch (ncp):</strong> {helicalResult.ncp}</div>
                  <div><strong>Lead:</strong> {helicalResult.lead}</div>
                  <div><strong>Normal Tooth Equivalent (nr):</strong> {helicalResult.nr}</div>
                  <div><strong>Tooth Height (h):</strong> {helicalResult.h}</div>
                  <div><strong>Z₂:</strong> {helicalResult.z2}</div>
                  <div><strong>gear Ratio:</strong> {helicalResult.computedRatio}</div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="differential">
          <Card>
            <CardContent className="grid gap-4 p-4">
              <Label>Required Ratio</Label>
              <Input type="number" step="0.001" value={requiredRatio} onChange={(e) => setRequiredRatio(parseFloat(e.target.value))} />
              <Label>Extra Gear Teeth</Label>
              <Input type="number" value={extraGear} onChange={(e) => setExtraGear(parseInt(e.target.value))} />
              <Label>Tolerance</Label>
              <Input type="number" step="0.001" value={tolerance} onChange={(e) => setTolerance(parseFloat(e.target.value))} />
              <Button className="mt-4" onClick={findGearCombinations}>Find Gear Sets</Button>
              <div className="mt-4">
                <strong>Matching Gear Combinations:</strong>
                {matches.length > 0 ? (
                  <ul className="list-disc pl-6">
                    {matches.map((set, index) => (
                      <li key={index}>
                        Z1: {set.z1}, Z2: {set.z2}, Z3: {set.z3}, Z4: {set.z4} → Ratio: {set.ratio.toFixed(4)}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">No matching sets found within tolerance.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GearCalculationUI;