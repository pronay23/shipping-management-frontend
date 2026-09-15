"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createVoyage } from "../api/voyageApi";

const initialContainer = {
  container_no: "",
  seal_no: "",
  bags: "",
  gross_weight_kgs: "",
  type_of_container: "45G1",
  status: "FCL",
  commodity_code: "35",
};

const initialBol = {
  bill_number: "",
  bol_nature: "23",
  bol_type_code: "HSB",
  consolidated_cargo: "0",
  port_of_loading: "",
  port_of_discharge: "",
  shipping_agent_code: "SLA",
  shipping_agent_name: "SPRING SEA SHIPPING LINES AGENTS AG",
  exporter_name: "",
  exporter_address: "",
  notify_code: "",
  notify_name: "",
  notify_address: "",
  consignee_code: "",
  consignee_name: "",
  consignee_address: "",
  package_type_code: "BG",
  shipping_marks: "N/M",
  product_name: "",
  volume_in_cubic_meters: "0",
  freight_value: "0",
  freight_currency: "ZZZ",
  containers: [],
};

const initialForm = {
  vessel_name: "",
  voyage_number: "",
  port_of_loading: "",
  port_of_discharge: "",
  arrival_date: "",
  departure_date: "",
  status: "active",
  customs_office_code: "301",
  carrier_code: "301043077",
  carrier_name: "BANGLADESH CONTAINER LINES LIMITED",
  carrier_address: "36, JOY BANGLA TOWER 12TH FLOOR, AGRABAD C/A, CHATTOGRAM, BANGLADESH",
  mode_of_transport_code: "1",
  nationality_of_transporter_code: "BD",
  bols: [],
};

export default function VoyageForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<any>(initialForm);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleVoyageChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleBolChange = (bolIndex: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => {
      const newBols = [...prev.bols];
      newBols[bolIndex] = { ...newBols[bolIndex], [name]: value };
      return { ...prev, bols: newBols };
    });
  };

  const handleContainerChange = (bolIndex: number, containerIndex: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => {
      const newBols = [...prev.bols];
      const newContainers = [...newBols[bolIndex].containers];
      newContainers[containerIndex] = { ...newContainers[containerIndex], [name]: value };
      newBols[bolIndex].containers = newContainers;
      return { ...prev, bols: newBols };
    });
  };

  const addBol = () => {
    setFormData((prev: any) => ({
      ...prev,
      bols: [...prev.bols, { ...initialBol }],
    }));
  };

  const removeBol = (bolIndex: number) => {
    setFormData((prev: any) => ({
      ...prev,
      bols: prev.bols.filter((_: any, i: number) => i !== bolIndex),
    }));
  };

  const addContainer = (bolIndex: number) => {
    setFormData((prev: any) => {
      const newBols = [...prev.bols];
      newBols[bolIndex].containers.push({ ...initialContainer });
      return { ...prev, bols: newBols };
    });
  };

  const removeContainer = (bolIndex: number, containerIndex: number) => {
    setFormData((prev: any) => {
      const newBols = [...prev.bols];
      newBols[bolIndex].containers = newBols[bolIndex].containers.filter((_: any, i: number) => i !== containerIndex);
      return { ...prev, bols: newBols };
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    try {
      await createVoyage(formData);
      setMessage("Voyage with nested Bills of Lading and Containers created successfully.");
      setFormData(initialForm);
      setTimeout(() => router.push("/features/voyage/list"), 1200);
    } catch (error) {
      setMessage(error instanceof Error ? `Error: ${error.message}` : "Failed to create voyage.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F1F5F9] text-[#16212B]">
      <header className="border-b border-[#D8D0BC] bg-[#0B2542] text-[#F1F5F9]">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#F1F5F9] bg-transparent font-mono text-sm font-semibold">V</div>
            <div>
              <h1 className="font-serif text-xl font-semibold leading-tight">New Voyage (Nested Form)</h1>
              <p className="font-mono text-xs text-[#B9C6D6]">Create Voyage, Bills of Lading, and Containers for IGM / EGM XML generation</p>
            </div>
          </div>
          <a href="/features/voyage/list" className="rounded border border-[#B9C6D6] px-3 py-2 text-xs transition hover:bg-white/10">← All Voyages</a>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* VOYAGE SECTION */}
          <section className="rounded-lg border border-[#D8D0BC] bg-white p-6 shadow-sm">
            <h2 className="mb-4 font-serif text-[1.15rem] font-semibold text-[#0B2542]">Voyage Details</h2>
            <div className="grid gap-5 md:grid-cols-3">
              {[
                ["vessel_name", "Vessel Name *"], ["voyage_number", "Voyage Number *"],
                ["port_of_loading", "Port of Loading"], ["port_of_discharge", "Port of Discharge"],
                ["arrival_date", "Arrival Date", "date"], ["departure_date", "Departure Date", "date"],
                ["customs_office_code", "Customs Office Code"], ["carrier_code", "Carrier Code"],
                ["carrier_name", "Carrier Name"], ["carrier_address", "Carrier Address"],
                ["mode_of_transport_code", "Mode of Transport Code"], ["nationality_of_transporter_code", "Nationality of Transporter Code"]
              ].map(([name, label, type = "text"]) => (
                <label key={name} className="block text-sm">
                  <span className="mb-1 block text-[0.68rem] font-semibold uppercase text-[#3E6990]">{label}</span>
                  <input
                    name={name} type={type} value={formData[name]} onChange={handleVoyageChange}
                    required={name.includes("*")}
                    className="w-full border-0 border-b border-[#D8D0BC] bg-transparent px-0 py-2 outline-none focus:border-[#B9662E]"
                  />
                </label>
              ))}
            </div>
          </section>

          {/* BOLs SECTION */}
          {formData.bols.map((bol: any, bolIndex: number) => (
            <section key={bolIndex} className="rounded-lg border-l-4 border-[#3E6990] bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-serif text-lg font-semibold text-[#0B2542]">Bill of Lading #{bolIndex + 1}</h3>
                <button type="button" onClick={() => removeBol(bolIndex)} className="text-sm text-red-600 hover:text-red-800">Remove BOL</button>
              </div>
              
              <div className="grid gap-4 md:grid-cols-4 mb-6">
                {[
                  ["bill_number", "Bill Number *"], ["bol_nature", "BOL Nature"], ["bol_type_code", "BOL Type Code"],
                  ["consolidated_cargo", "Consolidated Cargo"], ["port_of_loading", "Port of Origin"],
                  ["port_of_discharge", "Place of Unloading"], ["shipping_agent_code", "Shipping Agent Code"],
                  ["shipping_agent_name", "Shipping Agent Name"], ["exporter_name", "Exporter Name"],
                  ["exporter_address", "Exporter Address"], ["notify_code", "Notify Code"],
                  ["notify_name", "Notify Name"], ["notify_address", "Notify Address"],
                  ["consignee_code", "Consignee Code"], ["consignee_name", "Consignee Name"],
                  ["consignee_address", "Consignee Address"], ["package_type_code", "Package Type Code"],
                  ["shipping_marks", "Shipping Marks"], ["product_name", "Goods Description"],
                  ["volume_in_cubic_meters", "Volume (CBM)"], ["freight_value", "Freight Value"],
                  ["freight_currency", "Freight Currency"]
                ].map(([name, label]) => (
                  <label key={name} className="block text-sm">
                    <span className="mb-1 block text-[0.6rem] font-semibold uppercase text-gray-500">{label}</span>
                    <input
                      name={name} type="text" value={bol[name] || ""} onChange={(e) => handleBolChange(bolIndex, e)}
                      required={name.includes("*")}
                      className="w-full border-b border-gray-300 py-1 text-sm outline-none focus:border-[#3E6990]"
                    />
                  </label>
                ))}
              </div>

              {/* CONTAINERS SECTION */}
              <div className="ml-4 pl-4 border-l-2 border-gray-200">
                <h4 className="mb-3 font-semibold text-gray-700">Containers</h4>
                {bol.containers.map((container: any, containerIndex: number) => (
                  <div key={containerIndex} className="mb-4 bg-gray-50 p-4 rounded relative">
                    <button type="button" onClick={() => removeContainer(bolIndex, containerIndex)} className="absolute top-2 right-2 text-xs text-red-500 hover:text-red-700">Remove</button>
                    <div className="grid gap-3 md:grid-cols-4">
                      {[
                        ["container_no", "Container No *"], ["seal_no", "Seal No"], ["bags", "Packages/Bags"],
                        ["gross_weight_kgs", "Gross Weight"], ["type_of_container", "Type of Container"],
                        ["status", "Status"], ["commodity_code", "Commodity Code"]
                      ].map(([name, label]) => (
                        <label key={name} className="block text-sm">
                          <span className="mb-1 block text-[0.6rem] font-semibold text-gray-500">{label}</span>
                          <input
                            name={name} type="text" value={container[name] || ""} onChange={(e) => handleContainerChange(bolIndex, containerIndex, e)}
                            required={name.includes("*")}
                            className="w-full border-b border-gray-300 bg-transparent py-1 text-sm outline-none focus:border-blue-500"
                          />
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
                <button type="button" onClick={() => addContainer(bolIndex)} className="text-sm font-medium text-blue-600 hover:text-blue-800">+ Add Container</button>
              </div>
            </section>
          ))}

          <button type="button" onClick={addBol} className="block w-full rounded border-2 border-dashed border-[#3E6990] py-4 text-center text-[#3E6990] hover:bg-blue-50">
            + Add Bill of Lading
          </button>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-6">
            <button type="submit" disabled={isSubmitting} className="rounded bg-[#0B2542] px-6 py-3 font-medium text-white hover:bg-[#123058] disabled:opacity-70">
              {isSubmitting ? "Saving All Data..." : "Save Voyage, BOLs & Containers"}
            </button>
          </div>

          {message && (
            <div className={`rounded p-4 text-sm ${message.startsWith("Error") ? "bg-red-100 text-red-700" : "bg-green-100 text-green-800"}`}>
              {message}
            </div>
          )}
        </form>
      </main>
    </div>
  );
}
