"use client";

import React, { useEffect, useMemo, useState } from "react";
import type { ContainerRowPayload } from "../types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ?? "http://127.0.0.1:8000/api";

interface Props {
	containers?: ContainerRowPayload[] | any[];
	billId?: string | number;
	className?: string;
}

export default function ContainerManifestTable({ containers: propContainers, billId, className }: Props) {
	const [containers, setContainers] = useState<any[]>(propContainers ?? []);
	const [searchTerm, setSearchTerm] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (propContainers) {
			setContainers(propContainers);
			return;
		}
		if (!billId) return;

		let cancelled = false;
		setLoading(true);
		setError(null);

		fetch(`${API_BASE_URL}/bill-of-ladings/${billId}`)
			.then((res) => {
				if (!res.ok) throw new Error(`Failed to load (${res.status})`);
				return res.json();
			})
			.then((data) => {
				if (cancelled) return;
				// expect server to return bill with containers in `container_manifests` or `containers`
				const list = data.container_manifests ?? data.containers ?? data.containerManifests ?? [];
				setContainers(Array.isArray(list) ? list : []);
			})
			.catch((err: unknown) => {
				if (cancelled) return;
				setError(err instanceof Error ? err.message : String(err));
			})
			.finally(() => {
				if (!cancelled) setLoading(false);
			});

		return () => {
			cancelled = true;
		};
	}, [propContainers, billId]);

	const filteredContainers = useMemo(() => {
		const normalized = searchTerm.trim().toLowerCase();
		if (!normalized) return containers;

		return containers.filter((c) => {
			const billNo = String(c.bill_number ?? c.billNumber ?? "").toLowerCase();
			return billNo.includes(normalized);
		});
	}, [containers, searchTerm]);

	const totals = useMemo(() => {
		return filteredContainers.reduce(
			(acc, c) => {
				const bags = Number(c.bags ?? c.Bags ?? 0) || 0;
				const gross = Number(c.gross_weight_kgs ?? c.gross_kg ?? c.grossKg ?? 0) || 0;
				const measure = Number(c.measurement_m3 ?? c.measure_m3 ?? c.measureM3 ?? 0) || 0;
				acc.bags += bags;
				acc.gross += gross;
				acc.measure += measure;
				return acc;
			},
			{ bags: 0, gross: 0, measure: 0 }
		);
	}, [filteredContainers]);

	return (
		<div className={className}>
			<div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<label className="block text-sm font-semibold text-slate-700">Search by B/L No.</label>
					<input
						type="search"
						value={searchTerm}
						onChange={(event) => setSearchTerm(event.target.value)}
						placeholder="Enter bill number"
						className="mt-1 w-full max-w-sm rounded border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
					/>
				</div>
				<div className="text-sm text-slate-500">
					{filteredContainers.length} of {containers.length} container rows
				</div>
			</div>
			<div className="overflow-x-auto">
				<table className="min-w-[760px] w-full text-sm">
					<thead>
						<tr className="border-b border-[#0B2542] text-left">
							<th className="w-8 px-2 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.06em] text-[#3E6990]">#</th>
							<th className="px-2 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.06em] text-[#3E6990]">B/L No.</th>
							<th className="px-2 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.06em] text-[#3E6990]">Bill Type</th>
							<th className="px-2 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.06em] text-[#3E6990]">Container No.</th>
							<th className="px-2 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.06em] text-[#3E6990]">Seal No.</th>
							<th className="px-2 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.06em] text-[#3E6990]">Bags</th>
							<th className="px-2 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.06em] text-[#3E6990]">Gross Wt (KGS)</th>
							<th className="px-2 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.06em] text-[#3E6990]">Measurement (M3)</th>
						</tr>
					</thead>
					<tbody>
						{loading ? (
							<tr>
								<td colSpan={8} className="px-2 py-4 text-sm text-[#3E6990]">Loading...</td>
							</tr>
						) : error ? (
							<tr>
								<td colSpan={8} className="px-2 py-4 text-sm text-red-600">{error}</td>
							</tr>
						) : containers.length === 0 ? (
							<tr>
								<td colSpan={8} className="px-2 py-4 text-sm text-[#3E6990]">No containers</td>
							</tr>
						) : (
							filteredContainers.map((c, i) => {
								const containerNo = c.container_no ?? c.containerNo ?? "";
								const sealNo = c.seal_no ?? c.sealNo ?? "";
								const bags = c.bags ?? "";
								const gross = c.gross_weight_kgs ?? c.gross_kg ?? c.grossKg ?? "";
								const measure = c.measurement_m3 ?? c.measure_m3 ?? c.measureM3 ?? "";
								return (
									<tr key={i} className="border-b border-[#D8D0BC]">
										<td className="px-2 py-2 font-mono text-xs text-[#3E6990]">{String(i + 1).padStart(2, "0")}</td>
										<td className="px-2 py-2">{c.bill_number ?? c.billNumber ?? ""}</td>
                                        <td className="px-2 py-2">{c.bill_type ?? c.billType ?? ""}</td>
                                        <td className="px-2 py-2">{containerNo}</td>
										<td className="px-2 py-2">{sealNo}</td>
										<td className="px-2 py-2">{bags !== null ? String(bags) : ""}</td>
										<td className="px-2 py-2">{gross !== null ? Number(gross).toFixed(3) : ""}</td>
										<td className="px-2 py-2">{measure !== null ? Number(measure).toFixed(3) : ""}</td>
									</tr>
								);
							})
						)}
					</tbody>
					<tfoot>
						<tr className="border-t-2 border-[#0B2542] font-semibold font-mono">
							<td className="px-2 py-2" colSpan={5}>Total ({filteredContainers.length} containers)</td>
							<td className="px-2 py-2">{totals.bags.toLocaleString()}</td>
							<td className="px-2 py-2">{totals.gross.toFixed(3)}</td>
							<td className="px-2 py-2">{totals.measure.toFixed(3)}</td>
						</tr>
					</tfoot>
				</table>
			</div>
		</div>
	);
}
