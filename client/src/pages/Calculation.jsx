import React, { useState } from "react";
import { Card, CardContent } from "../components/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/tabls"
import { Input } from "../components/input";
import { Label } from "../components/label";
import { Button } from "../components/Cbutton";

const GearCalculationUI = () => {

  const [spurTeeth, setSpurTeeth] = useState('');
  const [spurModule, setSpurModule] = useState('');
  const [spurResult, setSpurResult] = useState(null);

  const calculateSpurGear = () => {
    const teeth = parseFloat(spurTeeth);
    const module = parseFloat(spurModule);

    if (!isNaN(teeth) && !isNaN(module)) {
      const pd = module * Math.PI;
      const od = module * (teeth + 2);
      const h = (13/6) * module; 
      const id = od - (2 * h);
      const c = (1/6) * module;
      const D = (7/6) * module;
      const B = module * 10; 

      setSpurResult({od: od.toFixed(2),
      pd: pd.toFixed(2),
      h: h.toFixed(2),
      id: id.toFixed(2),
      c: c.toFixed(2),
      D: D .toFixed(2),
      B: B.toFixed(2)
    
    });

    } else {
      setSpurResult("Invalid input");
    }
  };

  const calculateHelicalgear = () => {


  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Gear Calculation Tool</h1>
      <Tabs defaultValue="spur" className="w-full">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="spur">Spur Gear</TabsTrigger>
          <TabsTrigger value="helical">Helical Gear</TabsTrigger>
          <TabsTrigger value="bevel">Bevel Gear</TabsTrigger>
          <TabsTrigger value="worm">Worm Gear</TabsTrigger>
        </TabsList>

        {/* Spur Gear Tab */}
        <TabsContent value="spur">
          <Card>
            <CardContent className="grid gap-4 p-4">
              <Label>Number of Teeth</Label>
              <Input type="number" value={spurTeeth}
              onChange={(e) => setSpurTeeth(e.target.value)}
              placeholder="e.g. 20" />
              <Label>Module</Label>
              <Input type="number" value={spurModule}
              onChange={(e) => setSpurModule(e.target.value)}
              placeholder="e.g. 2.5" />
              <Button className="mt-4" onClick={calculateSpurGear}>Calculate Spur Gear</Button>

              {/* Result Displayd here */}
              {spurResult !== null && (
                <div className="mt-4 text-lg">
                  <strong>OUTER DIMETOR :</strong> {spurResult.od}
                  <br></br>
                  <strong>PITCH CIRCAL DIMETOR :</strong> {spurResult.pd}
                  <br></br>
                  <strong>INSIDE DIMETOR :</strong> {spurResult.id}
                  <br></br>
                  <strong>HIGHT :</strong> {spurResult.h}
                  <br></br>
                  <strong>CLEARNACE :</strong> {spurResult.c}
                  <br></br>
                  <strong>DIDEMDAM :</strong> {spurResult.D}
                  <br></br>
                  <strong>BREATH :</strong> {spurResult.B}
                </div>
                
              )}

            </CardContent>
          </Card>
        </TabsContent>

        {/* Helical Gear Tab */}
        <TabsContent value="helical">
          <Card>
            <CardContent className="grid gap-4 p-4">
              <Label>Number of Teeth</Label>
              <Input type="number" placeholder="e.g. 30" />
              <Label>Module</Label>
              <Input type="number" placeholder="e.g. 3.0" />
              <Label>Helix Angle (°)</Label>
              <Input type="number" placeholder="e.g. 15" />
              <Button className="mt-4">Calculate Helical Gear</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Bevel Gear Tab */}
        <TabsContent value="bevel">
          <Card>
            <CardContent className="grid gap-4 p-4">
              <Label>Number of Teeth (Pinion)</Label>
              <Input type="number" placeholder="e.g. 12" />
              <Label>Number of Teeth (Gear)</Label>
              <Input type="number" placeholder="e.g. 36" />
              <Label>Module</Label>
              <Input type="number" placeholder="e.g. 4.0" />
              <Button className="mt-4">Calculate Bevel Gear</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Worm Gear Tab */}
        <TabsContent value="worm">
          <Card>
            <CardContent className="grid gap-4 p-4">
              <Label>Worm Threads</Label>
              <Input type="number" placeholder="e.g. 1" />
              <Label>Gear Teeth</Label>
              <Input type="number" placeholder="e.g. 40" />
              <Label>Module</Label>
              <Input type="number" placeholder="e.g. 2.0" />
              <Button className="mt-4">Calculate Worm Gear</Button>


            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>



  );
};

export default GearCalculationUI;
