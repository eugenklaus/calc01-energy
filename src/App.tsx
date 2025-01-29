import React, { useState, useEffect } from 'react';
import { Calculator, Zap, Flame, Car, ArrowRight, RefreshCw } from 'lucide-react';

interface CalculatorState {
  // Stromkosten
  stromVerbrauch: string;
  stromPreis: string;
  stromGrundgebuehr: string;
  // Heizkosten
  heizungsArt: 'gas' | 'oel';
  heizVerbrauch: string;
  heizPreis: string;
  heizGrundgebuehr: string;
  // Photovoltaik
  pvKwp: string;
  // Verbrauchsanteile
  autarkiegrad: string;
  eigenverbrauch: string;
  einspeiseverguetung: string;
  strompreisZukauf: string;
  // Finanzierung
  finanzierungsRate: string;
  laufzeit: string;
  finanzierungMitKosten: string;
  finanzierungMitAnschaffung: string;
  finanzierungOhneKosten: string;
  finanzierungOhneAnschaffung: string;
}

function App() {
  const [values, setValues] = useState<CalculatorState>({
    stromVerbrauch: '',
    stromPreis: '',
    stromGrundgebuehr: '',
    heizungsArt: 'gas',
    heizVerbrauch: '',
    heizPreis: '',
    heizGrundgebuehr: '',
    pvKwp: '',
    autarkiegrad: '',
    eigenverbrauch: '',
    einspeiseverguetung: '',
    strompreisZukauf: '',
    finanzierungsRate: '',
    laufzeit: '',
    finanzierungMitKosten: '',
    finanzierungMitAnschaffung: '',
    finanzierungOhneKosten: '',
    finanzierungOhneAnschaffung: ''
  });

  const [results, setResults] = useState({
    strom: { jahr: 0, monat: 0 },
    heizung: { jahr: 0, monat: 0, bedarf: 0 },
    pv: { ertragJahr: 0 },
    vergleich: {
      monat: {
        strom: { ist: 0, soll: 0 },
        heizung: { ist: 0, soll: 0 },
        ev: { ist: 0, soll: 0 },
        gesamt: { ist: 0, soll: 0, ersparnis: 0 }
      },
      jahr: {
        strom: { ist: 0, soll: 0 },
        heizung: { ist: 0, soll: 0 },
        ev: { ist: 0, soll: 0 },
        gesamt: { ist: 0, soll: 0, ersparnis: 0 }
      }
    },
    finanzierung: {
      monat: { ist: 0, rate: 0, ergebnis: 0 },
      jahr: { ist: 0, rate: 0, ergebnis: 0 }
    },
    vorteil: {
      mit: { kosten: 0, ersparnis: 0 },
      ohne: { kosten: 0, ersparnis: 0 }
    }
  });

  const handleInputChange = (key: keyof CalculatorState, value: string) => {
    setValues(prev => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    // Calculate Stromkosten
    const stromJahr = (Number(values.stromVerbrauch) * Number(values.stromPreis)) + 
                     Number(values.stromGrundgebuehr);
    const stromMonat = stromJahr / 12;

    // Calculate Heizkosten
    const heizJahr = (Number(values.heizVerbrauch) * Number(values.heizPreis)) + 
                    Number(values.heizGrundgebuehr);
    const heizMonat = heizJahr / 12;
    const heizBedarf = Number(values.heizVerbrauch) * (values.heizungsArt === 'gas' ? 10 : 10.5);

    // Calculate PV Ertrag
    const pvErtrag = Number(values.pvKwp) * 950; // Durchschnittlicher Ertrag in Deutschland

    setResults(prev => ({
      ...prev,
      strom: { jahr: stromJahr, monat: stromMonat },
      heizung: { jahr: heizJahr, monat: heizMonat, bedarf: heizBedarf },
      pv: { ertragJahr: pvErtrag }
    }));
  }, [values]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 pb-12">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Calculator className="w-8 h-8 text-purple-600" />
            <h1 className="text-3xl font-bold text-gray-900">Kewo-Rechner</h1>
          </div>
        </div>

        {/* Stromkosten */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Zap className="w-6 h-6 text-purple-600" />
            <h2 className="text-xl font-semibold">Ermittlung Stromkosten (Lichtstrom)</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Verbrauch kWh
                </label>
                <input
                  type="number"
                  value={values.stromVerbrauch}
                  onChange={(e) => handleInputChange('stromVerbrauch', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Strompreis kWh
                </label>
                <input
                  type="number"
                  value={values.stromPreis}
                  onChange={(e) => handleInputChange('stromPreis', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Grundgebühr
                </label>
                <input
                  type="number"
                  value={values.stromGrundgebuehr}
                  onChange={(e) => handleInputChange('stromGrundgebuehr', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Gesamt Jahr</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {results.strom.jahr.toFixed(2)} €
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Gesamt Monat</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {results.strom.monat.toFixed(2)} €
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Heizkosten */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Flame className="w-6 h-6 text-purple-600" />
            <h2 className="text-xl font-semibold">Ermittlung Heizkosten</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <select
                value={values.heizungsArt}
                onChange={(e) => handleInputChange('heizungsArt', e.target.value as 'gas' | 'oel')}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="gas">Gas</option>
                <option value="oel">Öl</option>
              </select>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Verbrauch
                </label>
                <input
                  type="number"
                  value={values.heizVerbrauch}
                  onChange={(e) => handleInputChange('heizVerbrauch', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preis pro kWh
                </label>
                <input
                  type="number"
                  value={values.heizPreis}
                  onChange={(e) => handleInputChange('heizPreis', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Grundgebühr
                </label>
                <input
                  type="number"
                  value={values.heizGrundgebuehr}
                  onChange={(e) => handleInputChange('heizGrundgebuehr', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Gesamt Jahr</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {results.heizung.jahr.toFixed(2)} €
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Gesamt Monat</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {results.heizung.monat.toFixed(2)} €
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Bedarf Wärmestrom</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {results.heizung.bedarf.toFixed(0)} kWh
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Photovoltaik */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Car className="w-6 h-6 text-purple-600" />
            <h2 className="text-xl font-semibold">Anlagengröße Photovoltaik</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                kWp
              </label>
              <input
                type="number"
                value={values.pvKwp}
                onChange={(e) => handleInputChange('pvKwp', e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            
            <div className="bg-gray-50 rounded-xl p-6">
              <p className="text-sm text-gray-600">Ertrag / Jahr</p>
              <p className="text-2xl font-bold text-purple-600">
                {results.pv.ertragJahr.toFixed(0)} kWh
              </p>
            </div>
          </div>
        </div>

        {/* Verbrauchsanteile */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-xl font-semibold mb-6">Verbrauchsanteile</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Autarkiegrad (%)
                </label>
                <input
                  type="number"
                  value={values.autarkiegrad}
                  onChange={(e) => handleInputChange('autarkiegrad', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Eigenverbrauchsanteil (%)
                </label>
                <input
                  type="number"
                  value={values.eigenverbrauch}
                  onChange={(e) => handleInputChange('eigenverbrauch', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Einspeisevergütung (€)
                </label>
                <input
                  type="number"
                  value={values.einspeiseverguetung}
                  onChange={(e) => handleInputChange('einspeiseverguetung', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Strompreis Zukauf (€)
                </label>
                <input
                  type="number"
                  value={values.strompreisZukauf}
                  onChange={(e) => handleInputChange('strompreisZukauf', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Comparison Tables */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Monthly Comparison */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-xl font-semibold mb-6">Vergleich Monat</h2>
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Position</th>
                  <th className="text-right py-2">Kosten ist</th>
                  <th className="text-right py-2">Kosten soll</th>
                  <th className="text-right py-2">Ersparnis</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-2">Strom</td>
                  <td className="text-right">{results.vergleich.monat.strom.ist.toFixed(2)} €</td>
                  <td className="text-right">{results.vergleich.monat.strom.soll.toFixed(2)} €</td>
                  <td className="text-right">{(results.vergleich.monat.strom.ist - results.vergleich.monat.strom.soll).toFixed(2)} €</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2">Heizung</td>
                  <td className="text-right">{results.vergleich.monat.heizung.ist.toFixed(2)} €</td>
                  <td className="text-right">{results.vergleich.monat.heizung.soll.toFixed(2)} €</td>
                  <td className="text-right">{(results.vergleich.monat.heizung.ist - results.vergleich.monat.heizung.soll).toFixed(2)} €</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2">EV</td>
                  <td className="text-right">{results.vergleich.monat.ev.ist.toFixed(2)} €</td>
                  <td className="text-right">{results.vergleich.monat.ev.soll.toFixed(2)} €</td>
                  <td className="text-right">{(results.vergleich.monat.ev.ist - results.vergleich.monat.ev.soll).toFixed(2)} €</td>
                </tr>
                <tr className="font-bold">
                  <td className="py-2">Gesamt</td>
                  <td className="text-right">{results.vergleich.monat.gesamt.ist.toFixed(2)} €</td>
                  <td className="text-right">{results.vergleich.monat.gesamt.soll.toFixed(2)} €</td>
                  <td className="text-right">{results.vergleich.monat.gesamt.ersparnis.toFixed(2)} €</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Yearly Comparison */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-xl font-semibold mb-6">Vergleich Jahr</h2>
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Position</th>
                  <th className="text-right py-2">Kosten ist</th>
                  <th className="text-right py-2">Kosten soll</th>
                  <th className="text-right py-2">Ersparnis</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-2">Strom</td>
                  <td className="text-right">{results.vergleich.jahr.strom.ist.toFixed(2)} €</td>
                  <td className="text-right">{results.vergleich.jahr.strom.soll.toFixed(2)} €</td>
                  <td className="text-right">{(results.vergleich.jahr.strom.ist - results.vergleich.jahr.strom.soll).toFixed(2)} €</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2">Heizung</td>
                  <td className="text-right">{results.vergleich.jahr.heizung.ist.toFixed(2)} €</td>
                  <td className="text-right">{results.vergleich.jahr.heizung.soll.toFixed(2)} €</td>
                  <td className="text-right">{(results.vergleich.jahr.heizung.ist - results.vergleich.jahr.heizung.soll).toFixed(2)} €</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2">EV</td>
                  <td className="text-right">{results.vergleich.jahr.ev.ist.toFixed(2)} €</td>
                  <td className="text-right">{results.vergleich.jahr.ev.soll.toFixed(2)} €</td>
                  <td className="text-right">{(results.vergleich.jahr.ev.ist - results.vergleich.jahr.ev.soll).toFixed(2)} €</td>
                </tr>
                <tr className="font-bold">
                  <td className="py-2">Gesamt</td>
                  <td className="text-right">{results.vergleich.jahr.gesamt.ist.toFixed(2)} €</td>
                  <td className="text-right">{results.vergleich.jahr.gesamt.soll.toFixed(2)} €</td>
                  <td className="text-right">{results.vergleich.jahr.gesamt.ersparnis.toFixed(2)} €</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Financing */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-xl font-semibold mb-6">Finanzierung</h2>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rate (€)
            </label>
            <input
              type="number"
              value={values.finanzierungsRate}
              onChange={(e) => handleInputChange('finanzierungsRate', e.target.value)}
              className="w-full md:w-1/3 px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Zeitraum</th>
                <th className="text-right py-2">Kosten ist</th>
                <th className="text-right py-2">Finanzierung</th>
                <th className="text-right py-2">Ergebnis</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-2">Monat</td>
                <td className="text-right">{results.finanzierung.monat.ist.toFixed(2)} €</td>
                <td className="text-right">{results.finanzierung.monat.rate.toFixed(2)} €</td>
                <td className="text-right">{results.finanzierung.monat.ergebnis.toFixed(2)} €</td>
              </tr>
              <tr>
                <td className="py-2">Jahr</td>
                <td className="text-right">{results.finanzierung.jahr.ist.toFixed(2)} €</td>
                <td className="text-right">{results.finanzierung.jahr.rate.toFixed(2)} €</td>
                <td className="text-right">{results.finanzierung.jahr.ergebnis.toFixed(2)} €</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Advantage Calculation */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-xl font-semibold mb-6">Vorteil ermitteln</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Laufzeit (Jahre)
                </label>
                <input
                  type="number"
                  value={values.laufzeit}
                  onChange={(e) => handleInputChange('laufzeit', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <h3 className="font-medium text-gray-900 mb-4">Mit Finanzierung</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Kosten (€)
                    </label>
                    <input
                      type="number"
                      value={values.finanzierungMitKosten}
                      onChange={(e) => handleInputChange('finanzierungMitKosten', e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Anschaffungssumme (€)
                    </label>
                    <input
                      type="number"
                      value={values.finanzierungMitAnschaffung}
                      onChange={(e) => handleInputChange('finanzierungMitAnschaffung', e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-900 mb-4">Ohne Finanzierung</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Kosten (€)
                    </label>
                    <input
                      type="number"
                      value={values.finanzierungOhneKosten}
                      onChange={(e) => handleInputChange('finanzierungOhneKosten', e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Anschaffungssumme (€)
                    </label>
                    <input
                      type="number"
                      value={values.finanzierungOhneAnschaffung}
                      onChange={(e) => handleInputChange('finanzierungOhneAnschaffung', e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="font-medium text-gray-900 mb-6">
                Vorteil auf {values.laufzeit || '0'} Jahre
              </h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Mit Finanzierung</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Bleibende Kosten</p>
                      <p className="text-xl font-bold text-purple-600">
                        {results.vorteil.mit.kosten.toFixed(2)} €
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Ersparnis</p>
                      <p className="text-xl font-bold text-purple-600">
                        {results.vorteil.mit.ersparnis.toFixed(2)} €
                      </p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Ohne Finanzierung</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Bleibende Kosten</p>
                      <p className="text-xl font-bold text-purple-600">
                        {results.vorteil.ohne.kosten.toFixed(2)} €
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Ersparnis</p>
                      <p className="text-xl font-bold text-purple-600">
                        {results.vorteil.ohne.ersparnis.toFixed(2)} €
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* PDF Button */}
        <div className="flex justify-center">
           <button
            className="bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
            onClick={() => {
              // PDF generation logic would go here
              alert('PDF-Generierung wird implementiert');
            }}
          >
            <ArrowRight className="w-5 h-5" />
            PDF erstellen
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;