import { faFilter, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAppContext } from "@/context/AppContext";
import Button from "@/components/buttons/Button";
import axiosInstance from "@/plugins/axios";
import FuncionariosFiltro from "./FuncionariosFiltro";
import TableFuncionarios from "./TableFuncionarios";

const Funcionarios = ({ active }) => {
	const [funcionarios, setFuncionarios] = useState([]);

	const { toast } = useAppContext();
	const [isFuncionariosLoading, setIsFuncionariosLoading] = useState(false);
	const [isFilterExpanded, setIsFilterExpanded] = useState(false);

	const [filtrosPesquisa, setFiltrosPesquisa] = useState({
		cd_unidade: "",
		id_sexo: "",
		id_possui_filhos: "",
		id_comemora_aniversario: "",
		dt_ultima_atualizacao_de: "",
		dt_ultima_atualizacao_ate: "",
		id_parente_pai: "",
		id_parente_mae: "",
		id_parente_conjuge: "",
		id_campanha_pendente: "",
	});

	useEffect(() => {
		if (!(Object.keys(filtrosPesquisa).length > 0) && !active) return;
	}, [active]);

	const getFuncionarios = async () => {
		setIsFuncionariosLoading(true);
		const filtrosJoin = Object.entries(filtrosPesquisa)
			.map(([key, value]) => `${key}=${value}`)
			.join("&");
		await axiosInstance
			.get(`marketing/funcionarios-ativos${filtrosJoin ? `?${encodeURI(filtrosJoin)}` : ""}`)
			.then((response) => {
				setIsFuncionariosLoading(false);
				setFuncionarios(response.data);
			})
			.catch((error) => {
				setIsFuncionariosLoading(false);
				toast.error("Não foi possível carregar os funcionários.");
				console.error(error);
			})
			.finally(() => {
				setIsFuncionariosLoading(false);
			});
	};

	const fiterFuncionarios = async () => {
		setIsFilterExpanded(false);
		await getFuncionarios();
	};

	useEffect(() => {
		if (!active) return;
		fiterFuncionarios();
	}, [active]);

	useEffect(() => {
		const handleKeyDown = (event) => {
			if (isFilterExpanded && event.key === "Enter") {
				fiterFuncionarios();
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => {
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [isFilterExpanded, fiterFuncionarios]);

	return (
		<div className={`flex flex-col flex-wrap w-full h-full relative min-h-[75vh] ${active ? "" : "hidden"} overflow-y-hidden`}>

			<div className={`absolute col-span-2 mx-1 xl:mx-2 mt-2 xl:mt-[15px] mb-0 flex flex-row flex-wrap max-h-full min-h-10 overflow-hidden rounded-lg bg-white ${isFilterExpanded ? "w-80" : "w-40"}`}>
				<div
					className={`flex items-center flex-nowrap text-primary justify-between fixed bg-white p-1 xl:p-2 z-40 border ${isFilterExpanded ? " w-80 rounded-t-lg " : " w-32 shadow rounded-lg"
						}`}
					onClick={() => { setIsFilterExpanded(!isFilterExpanded); }}
				>
					<div className="flex flex-row gap-2 items-center">
						<FontAwesomeIcon icon={faFilter} width="16" height="16" />
						Filtros
					</div>
					<FontAwesomeIcon
						icon={faChevronDown}
						width="16"
						height="16"
						className={`${!isFilterExpanded && "rotate-180"} float-right`}
					/>
				</div>

				{isFilterExpanded && (
					<div className={`w-80 static left-2 top-14 bg-white shadow rounded-lg z-40`}>
						<div
							className={`flex-col flex-nowrap border rounded-lg shadow-lg w-full mt-2 relative flex`}
						>
							<div className="p-2 xl:p-4 pb-0 sticky top-2 z-40">
								<Button
									buttonType="primary"
									size="small"
									block
									onClick={fiterFuncionarios}
								>
									Aplicar Filtros
								</Button>
							</div>

							<div className="mt-2 xl:mt-5 mb-3 pt-0 p-2 xl:px-4 overflow-y-auto max-h-[60vh]">
								<FuncionariosFiltro
									filtrosPesquisa={filtrosPesquisa}
									setFiltrosPesquisa={setFiltrosPesquisa}
								/>
							</div>
						</div>
					</div>
				)}
			</div>

			<div className="col-span-12 m-2" onClick={() => setIsFilterExpanded(false)}>
				<TableFuncionarios
					data={funcionarios}
					isLoading={isFuncionariosLoading}
					filtrosPesquisa={filtrosPesquisa}
					refreshTab={fiterFuncionarios}
				></TableFuncionarios>
			</div>
		</div>
	);
};

export default Funcionarios;