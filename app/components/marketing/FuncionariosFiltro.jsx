import { DebouncedSearch } from "@/components/inputs/DebouncedSearch";
import { Subtitle } from "@/components/Layouts/Typography";
import InputDate from "@/components/inputs/InputDate";
import Checkbox from "@/components/inputs/Checkbox";
import Radio from "@/components/inputs/Radio";
import { useCallback } from "react";
import { cn } from "@/assets/utils";
import Button from "@/components/buttons/Button";
import { useAppContext } from "@/context/AppContext";

const FuncionariosFiltro = ({ filtrosPesquisa, setFiltrosPesquisa }) => {

	const setDadosFiltroPesquisaCallback = useCallback((id, value) => {
        setFiltrosPesquisa((prevState) => ({ ...prevState, [id]: value }));
    }, [setFiltrosPesquisa]);

    const { user } = useAppContext();

	const makeRadioToggleHandler = (campo, opcao) => {
		return () => {
			if (filtrosPesquisa[campo] === opcao) {
				setFiltrosPesquisa(prev => ({ ...prev, [campo]: "" }));
			}
		};
	};

	return (
		<>
			{/* UNIDADE */}
			<div className="flex flex-col w-full border-b-2 my-2 font-semibold">
				<Subtitle>Unidade</Subtitle>
			</div>
			<div className="w-full">
				<DebouncedSearch.Root>
					<DebouncedSearch.Select
						id="cd_unidade_filtro"
						isClearable
						value={filtrosPesquisa.cd_unidade || ""}
						onChange={(value) =>
							setDadosFiltroPesquisaCallback("cd_unidade", value || "")
						}
                        urlGet={`unidade/lista-unidades/${user.user_sip}`}
                        optId={'CD_EMPRESA_AGRUPADORA'}
                        optLabel={'NM_EMPRESA'}
					/>
				</DebouncedSearch.Root>
			</div>

			{/* SEXO */}
			<div className="flex flex-col w-full border-b-2 my-2 font-semibold">
				<Subtitle>Sexo</Subtitle>
			</div>
			<div className="pt-1">
				<Radio
					value={"M"}
					id={"id_sexo_filtro_masc"}
					name={"id_sexo"}
					label={"Masculino"}
					checked={filtrosPesquisa.id_sexo === "M"}
					onChange={(id, value) => setDadosFiltroPesquisaCallback("id_sexo", value)}
					onClick={makeRadioToggleHandler("id_sexo", "M")}
				/>
			</div>
			{/* ButtonToggle */}
			<div className="pt-1">
				<Radio
					value={"F"}
					id={"id_sexo_filtro_femi"}
					name={"id_sexo"}
					label={"Feminino"}
					checked={filtrosPesquisa.id_sexo === "F"}
					onChange={(id, value) => setDadosFiltroPesquisaCallback("id_sexo", value)}
					onClick={makeRadioToggleHandler("id_sexo", "F")}
				/>
			</div>
			<div className="pt-1">
				<Radio
					value={"AM"}
					id={"id_sexo_filtro_ambos"}
					name={"id_sexo"}
					label={"Ambos"}
					checked={filtrosPesquisa.id_sexo === "AM"}
					onChange={(id, value) => setDadosFiltroPesquisaCallback("id_sexo", value)}
					onClick={makeRadioToggleHandler("id_sexo", "AM")}
				/>
			</div>

			{/* POSSUI FILHOS */}
			<div className="flex flex-col w-full border-b-2 my-2 font-semibold">
				<Subtitle>Possui Filhos</Subtitle>
			</div>
			<div className="pt-1">
				<Radio
					value={"S"}
					id={"id_possui_filhos_s"}
					name={"id_possui_filhos"}
					label={"Sim"}
					checked={filtrosPesquisa.id_possui_filhos === "S"}
					onChange={(id, value) => setDadosFiltroPesquisaCallback("id_possui_filhos", value)}
					onClick={makeRadioToggleHandler("id_possui_filhos", "S")}
				/>
			</div>
			<div className="pt-1">
				<Radio
					value={"N"}
					id={"id_possui_filhos_n"}
					name={"id_possui_filhos"}
					label={"Não"}
					checked={filtrosPesquisa.id_possui_filhos === "N"}
					onChange={(id, value) => setDadosFiltroPesquisaCallback("id_possui_filhos", value)}
					onClick={makeRadioToggleHandler("id_possui_filhos", "N")}
				/>
			</div>
			<div className="pt-1">
				<Radio
					value={"NI"}
					id={"id_possui_filhos_ni"}
					name={"id_possui_filhos"}
					label={"Não Informado"}
					checked={filtrosPesquisa.id_possui_filhos === "NI"}
					onChange={(id, value) => setDadosFiltroPesquisaCallback("id_possui_filhos", value)}
					onClick={makeRadioToggleHandler("id_possui_filhos", "NI")}
				/>
			</div>

			{/* CELEBRAR ANIVERSÁRIO */}
			<div className="flex flex-col w-full border-b-2 my-2 font-semibold">
				<Subtitle>Celebrar Aniversário</Subtitle>
			</div>
			<div className="pt-1">
				<Radio
					value={"S"}
					id={"id_comemora_aniversario_s"}
					name={"id_comemora_aniversario"}
					label={"Sim"}
					checked={filtrosPesquisa.id_comemora_aniversario === "S"}
					onChange={(id, value) => setDadosFiltroPesquisaCallback("id_comemora_aniversario", value)}
					onClick={makeRadioToggleHandler("id_comemora_aniversario", "S")}
				/>
			</div>
			<div className="pt-1">
				<Radio
					value={"N"}
					id={"id_comemora_aniversario_n"}
					name={"id_comemora_aniversario"}
					label={"Não"}
					checked={filtrosPesquisa.id_comemora_aniversario === "N"}
					onChange={(id, value) => setDadosFiltroPesquisaCallback("id_comemora_aniversario", value)}
					onClick={makeRadioToggleHandler("id_comemora_aniversario", "N")}
				/>
			</div>
			<div className="pt-1">
				<Radio
					value={"NI"}
					id={"id_comemora_aniversario_ni"}
					name={"id_comemora_aniversario"}
					label={"Não Informado"}
					checked={filtrosPesquisa.id_comemora_aniversario === "NI"}
					onChange={(id, value) => setDadosFiltroPesquisaCallback("id_comemora_aniversario", value)}
					onClick={makeRadioToggleHandler("id_comemora_aniversario", "NI")}
				/>
			</div>

			{/* ÚLTIMA ATUALIZAÇÃO */}
			<div className="flex flex-col w-full border-b-2 my-2 font-semibold">
				<Subtitle>Última Atualização</Subtitle>
			</div>
			<div className="flex flex-col w-full my-2">
				<InputDate
					id="dt_ultima_atualizacao_de"
					label="De"
					value={filtrosPesquisa.dt_ultima_atualizacao_de || ""}
					onChange={(id, value) => setDadosFiltroPesquisaCallback("dt_ultima_atualizacao_de", value)}
				/>
			</div>
			<div className="flex flex-col w-full">
				<InputDate
					id="dt_ultima_atualizacao_ate"
					label="Até"
					value={filtrosPesquisa.dt_ultima_atualizacao_ate || ""}
					onChange={(id, value) => setDadosFiltroPesquisaCallback("dt_ultima_atualizacao_ate", value)}
				/>
			</div>

			{/* PARENTES CADASTRADOS */}
			<div className="flex flex-col w-full border-b-2 my-2 font-semibold">
				<Subtitle>Telefone de Parentes Cadastrados</Subtitle>
			</div>
			<div className="flex flex-row flex-wrap gap-x-4">
				<div className="pt-1">
					<Checkbox
						id={"id_parente_pai"}
						label={"Pai"}
						checked={filtrosPesquisa.id_parente_pai}
						onChange={(id, value) => setDadosFiltroPesquisaCallback("id_parente_pai", value)}
					/>
				</div>
				<div className="pt-1">
					<Checkbox
						id={"id_parente_mae"}
						label={"Mãe"}
						checked={filtrosPesquisa.id_parente_mae}
						onChange={(id, value) => setDadosFiltroPesquisaCallback("id_parente_mae", value)}
					/>
				</div>
				<div className="pt-1">
					<Checkbox
						id={"id_parente_conjuge"}
						label={"Cônjuge"}
						checked={filtrosPesquisa.id_parente_conjuge}
						onChange={(id, value) => setDadosFiltroPesquisaCallback("id_parente_conjuge", value)}
					/>
				</div>
			</div>

			{/* CAMPANHA PENDENTE */}
			<div className="flex flex-col w-full border-b-2 my-2 font-semibold">
				<Subtitle>Campanha Pendente</Subtitle>
			</div>
			<div className={cn("pt-1")}>
				<Radio
					value={"N"}
					id={"id_campanha_pendente_s"}
					name={"id_campanha_pendente"}
					label={"Sim"}
					checked={filtrosPesquisa.id_campanha_pendente === "N"}
					onChange={(id, value) => setDadosFiltroPesquisaCallback("id_campanha_pendente", value)}
					onClick={makeRadioToggleHandler("id_campanha_pendente", "N")}

				/>
			</div>
			<div className={cn("pt-1")}>
				<Radio
					value={"S"}
					id={"id_campanha_pendente_n"}
					name={"id_campanha_pendente"}
					label={"Não"}
					checked={filtrosPesquisa.id_campanha_pendente === "S"}
					onChange={(id, value) => setDadosFiltroPesquisaCallback("id_campanha_pendente", value)}
					onClick={makeRadioToggleHandler("id_campanha_pendente", "S")}
				/>
			</div>
		</>
	);
};

export default FuncionariosFiltro;