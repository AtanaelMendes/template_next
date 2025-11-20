import { useCallback, useEffect, useMemo, useState } from "react";
import { TooltipComponent } from "@/components/Layouts/TooltipComponent";
import { SortControl } from "@/components/Layouts/SortControl";
import { Pagination } from "@/components/Layouts/Pagination";
import { Caption } from "@/components/Layouts/Typography";
import PillsBadge from "@/components/buttons/PillsBadge";
import NoDataFound from "@/components/Layouts/NoDataFound";
import InputText from "@/components/inputs/InputText";
import { cn } from "@/assets/utils";
import Image from "next/image";
import FabAdd from "@/components/buttons/FloatActionButton";
import Dialog from "../Layouts/Dialog";
import { useAppContext } from "@/context/AppContext";
import axiosInstance from "@/plugins/axios";

const TableFuncionarios = ({
	data = [],
	isLoading = false,
	customHeight,
    filtrosPesquisa,
    refreshTab,
}) => {
	// filtro local por texto
	const [filter, setFilter] = useState({ filtro_dados_pessoais: "" });
	const [dataPagination, setDataPagination] = useState([]);
	const [applySort, setApplySort] = useState(false);
    const [filteredData, setFilteredData] = useState([]);
    const [showDialogCampanha, setShowDialogCampanha] = useState(false);

    const { toast} = useAppContext();

    const [selectedPessoas, setSelectedPessoas] = useState([]);

    // adiciona/remove conforme o checkbox
    const togglePessoaSelecionada = (cd_pessoa, checked) => {
        setSelectedPessoas(prev => {
            if (cd_pessoa == null) return prev;

            if (checked) {
                return prev.includes(cd_pessoa) ? prev : [...prev, cd_pessoa];
            }

            return prev.filter(p => p !== cd_pessoa);
        });
        return checked;
    };

    const handleDialogConfirm = () => {
        const pessoas = Array.from(selectedPessoas);
        if (pessoas.length === 0) {
            toast.warn("Selecione pelo menos uma pessoa.");
            return;
        }

        setShowDialogCampanha(true)
    }

    const enviarCampanhaMarketing = () => {
        axiosInstance
            .post("marketing/enviar-campanha", {
                pessoas: selectedPessoas,
                filtros: filtrosPesquisa
            })
            .then((response) => {
                if (response.status == 200) {
                    toast.success("Emails enviados com sucesso!");
                }
                refreshTab();
            })
            .catch((error) => {
                toast.error("Não foi possível enviar os emails");
                console.error(error);
            });

        setSelectedPessoas([])
    };


	const sexoBadge = (sexo) => {
		if (sexo === "F")
			return (
				<PillsBadge small type="warning">
					Feminino
				</PillsBadge>
			);
		if (sexo === "M")
			return (
				<PillsBadge small type="primary">
					Masculino
				</PillsBadge>
			);
		return (
			<PillsBadge small type="default">
				Não informado
			</PillsBadge>
		);
	};

	const comemoraBadge = (id) => {
		if (id === "S")
			return (
				<PillsBadge small type="success" className="gap-1">
					Comemora
				</PillsBadge>
			);
		if (id === "N")
			return (
				<PillsBadge small type="danger" className="gap-1">
                    Não comemora
				</PillsBadge>
			);
		return (
			<PillsBadge small type="default">
				-
			</PillsBadge>
		);
	};

	// paginação inicial
	useEffect(() => {
		if (data?.length) {
			setDataPagination(data.slice(0, 50));
		} else {
			setDataPagination([]);
		}
	}, [data]);

	// filtro local (texto busca em qualquer campo string)
	useEffect(() => {
		if (!data) return;

		if (filter.filtro_dados_pessoais) {
			const q = filter.filtro_dados_pessoais.toLowerCase();
			const filtered = data.filter((item) =>
				Object.values(item).some(
					(v) => typeof v === "string" && v.toLowerCase().includes(q)
				)
			);
			setDataPagination(filtered.slice(0, 50));
			setFilteredData?.(filtered);
		} else {
			setDataPagination(data.length > 0 ? data.slice(0, 50) : []);
			setFilteredData?.(data);
		}

		if (data.length > 0) {
			setApplySort(true);
		}
	}, [filter, data]);

	// callback de paginação
	const changePageAndData = useCallback((sliced) => {
		setDataPagination(sliced);
	}, []);

	// normalização para render
	const tempData = useMemo(() => {
		if (!dataPagination) return [];
		return dataPagination.map((row, idx) => ({
			__idx: idx,
			...row
		}));
	}, [dataPagination]);

	const setFilterTextCallback = (id, value) => {
		setFilter((prev) => ({ ...prev, [id]: value }));
	};

	// UI de linhas
	const dataToHtml = useCallback(() => {
		if (!(tempData?.length > 0)) {
			return <NoDataFound isLoading={isLoading} />;
		}

		return tempData.map((row, index) => {
			let url_foto = "/images/default/user-no-image.png";
			if (row.DS_FOTO_CANDIDATO) {
				url_foto = process.env.NEXT_PUBLIC_BASE_URL + "/site/imagem_candidato/" + row.DS_FOTO_CANDIDATO;
			}

            let campanhaAtiva = row.ID_VISUALIZADO == "N";

            let cursor = campanhaAtiva ? "cursor-not-allowed" : "cursor-pointer";

            let isSelecionada = selectedPessoas.includes(row.CD_PESSOA);

			return (
				<div
					key={`pessoa-row-${index}`}
					className={cn(
						"bg-white p-4 rounded-lg shadow-sm",
						"flex items-center gap-4 mb-4"
					)}
				>
					{/* Avatar à esquerda */}
					<div className="relative h-16 w-16 shrink-0 rounded-full overflow-hidden bg-gray-200">
						{/* Se você já usa next/image */}
						<Image
							src={url_foto}
							alt={row.NM_PESSOA || "Foto"}
							fill
							sizes="64px"
							style={{ objectFit: "cover" }}
						/>
					</div>

					{/* Grade principal: 5 colunas */}
					<div className="grid grid-cols-1 md:grid-cols-5 gap-x-6 gap-y-2 flex-1 text-sm text-gray-700">
						{/* Coluna 1 (linha 1) - Nome */}
						<div>
							<Caption>Nome:</Caption>
							<div className="text-blue-600 font-medium">
								{row.NM_PESSOA || "-"}
							</div>
						</div>

						{/* Coluna 2 (linha 1) - Telefone mãe */}
						<div>
                            <Caption>Telefone mãe:</Caption>
                                <div>{row.TEL_MAE || "-"}</div>
                                <div>{row.NM_MAE || "-"}</div>
						</div>

						{/* Coluna 3 (linha 1) - Camisa */}
						<div>
							<Caption>Camisa:</Caption>
							<div>{row.ID_TAMANHO_CAMISA || "-"}</div>
						</div>

						{/* Coluna 4 (linha 1) - Comemora aniversário (badge) */}
						<div>
							<Caption>Comemora aniversário:</Caption>
							<div>
								{comemoraBadge(row.ID_COMEMORA_ANIVERSARIO)}
							</div>
						</div>

						{/* Coluna 5 (linha 1) - Checkbox */}
						<div/>

						{/* Coluna 1 (linha 2) - Sexo (badge) */}
						<div>
							<Caption>Sexo:</Caption>
							<div>
								{sexoBadge(row.ID_SEXO)}
							</div>
						</div>

						{/* Coluna 2 (linha 2) - Telefone pai */}
						<div>
							<Caption>Telefone pai:</Caption>
							<div>{row.TEL_PAI || "-"}</div>
                            <div>{row.NM_PAI || "-"}</div>
						</div>

						{/* Coluna 3 (linha 2) - Calça */}
						<div>
							<Caption>Calça:</Caption>
							<div>{row.ID_TAMANHO_CALCA || "-"}</div>
						</div>

						{/* Coluna 4 (linha 2) - Alterado em */}
						<div>
							<Caption>Alterado em:</Caption>
							<div>{row.ALTERADO_EM || "-"}</div>
						</div>

						{/* Coluna 5 (linha 2) - vazio (reserva) */}
                            <div className={`flex items-center ${cursor}`}>
                                <label className={`inline-flex items-center gap-2 select-none`}>
                                    <TooltipComponent content={<span className={`font-semibold ${cursor}`}>{campanhaAtiva ? "Funcionário tem campanha ativa" : "Selecionar"}</span>} asChild>
                                        <input
                                            type="checkbox"
                                            className={`h-4 w-4 accent-blue-600 ${cursor}`}
                                            onChange={(e) => togglePessoaSelecionada(row.CD_PESSOA, e.target.checked)}
                                            disabled={campanhaAtiva}
                                            checked={isSelecionada}
                                            id={`campanhaAtiva_${row.CD_PESSOA}`}
                                        />
                                    </TooltipComponent>
                                </label>
                            </div>

						{/* Coluna 1 (linha 3) - Filhos */}
						<div>
							<Caption>Filhos:</Caption>
							<div>{row.NR_FILHO ?? "Não Informado"}</div>
						</div>

						{/* Coluna 2 (linha 3) - Telefone cônjuge */}
						<div>
							<Caption>Telefone cônjuge:</Caption>
							<div>{row.TEL_CONJUGE || "-"}</div>
							<div>{row.NM_CONJUGE || "-"}</div>
						</div>

						{/* Coluna 3 (linha 3) - Calçado */}
						<div>
							<Caption>Calçado:</Caption>
							<div>{row.NR_CALCADO || "-"}</div>
						</div>

						{/* Colunas 4 e 5 (linha 3) - vazias (reserva) */}
						<div />
						<div />
					</div>
				</div>
			);
		});
	}, [tempData, selectedPessoas]);

	return (
		<div className="flex flex-col bg-white">
			{/* Header: Ordenação + Filtro */}
			<div className="flex items-center gap-2 w-full justify-end border-b-2">
				<div className="flex justify-end mb-2">
					<SortControl
						configOptions={[
							{
								label: "Nome",
								field: "NM_PESSOA",
								type: "string",
							},
							{ label: "Sexo", field: "ID_SEXO", type: "string" },
							{
								label: "Filhos",
								field: "NR_FILHO",
								type: "number",
							},
							{
								label: "Camisa",
								field: "ID_TAMANHO_CAMISA",
								type: "string",
							},
							{
								label: "Calça",
								field: "ID_TAMANHO_CALCA",
								type: "string",
							},
							{
								label: "Calçado",
								field: "NR_CALCADO",
								type: "number",
							},
							{
								label: "Alterado em",
								field: "ALTERADO_EM",
								type: "date",
							},
						]}
						applySort={applySort}
						dataObject={filteredData ?? data}
						setApplySortFn={setApplySort}
						setSortedDataFn={setFilteredData}
					/>
				</div>

				<div className="flex flex-col items-end p-0.5 xl:py-2 w-1/3 xl:w-1/4">
					<InputText
						className="p-1.5 text-xs xl:p-2 xl:text-sm"
						placeholder="Filtrar"
						clearable
						helperText={`Exibindo ${
							dataPagination?.length ?? 0
						} de ${(filteredData ?? data)?.length ?? 0}`}
						onChange={setFilterTextCallback}
						id="filtro_dados_pessoais"
					/>
				</div>
			</div>

			{/* Lista (cards) */}
			<div
				className={`flex-1 ${
					customHeight || "max-h-[75vh]"
				} overflow-y-auto pb-48`}
			>
				{dataToHtml()}
			</div>

			{/* Paginação */}
			<div className="flex justify-center mb-4">
				<Pagination
					data={filteredData ?? data}
					callBackChangePage={changePageAndData}
					size="sm"
				/>
			</div>
            <FabAdd
                id="btn-enviar-campnha"
                className="bottom-10 right-10"
                onClick={() => handleDialogConfirm()}
            />

            <Dialog
                small
                btnCancel={"CANCELAR"}
                btnAccept={"CONFIRMAR"}
                hideTextArea={true}
                showDialog={showDialogCampanha}
                setDialogControl={setShowDialogCampanha}
                confirmActionCallback={() => {
                    enviarCampanhaMarketing();
                }}
                title={"Gostaria de pedir atualização para as pessoas selecionadas?"}
            />
		</div>
	);
};

export default TableFuncionarios;