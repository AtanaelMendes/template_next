import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useEffect, useCallback } from "react";
import { faGear } from "@fortawesome/free-solid-svg-icons";
import NoDataFound from "@/components/Layouts/NoDataFound";
import Loading from "@/components/Layouts/Loading";
import Button from "@/components/buttons/Button";
import axiosInstance from "@/plugins/axios";
import { useAppContext } from "@/context/AppContext";
import { FieldLabel, Subtitle } from "@/components/Layouts/Typography";
import WarningMessage from "@/components/Layouts/WarningMessage";
import { cn, empty } from "@/assets/utils";
import Checkbox from "@/components/inputs/Checkbox";

const GeraLaudoMedico = ({ active, reload, cdPessoaCandidato }) => {
	const { toast, user } = useAppContext();
	const [showLoading, setShowLoading] = useState(false);
	const [deficienciasSelecionadas, setDeficienciasSelecionadas] = useState(
		[]
	);
	const [deficiencia, setDeficiencia] = useState([]);

	useEffect(() => {
		if (active) {
			setShowLoading(true);
			getDadosDeficiencia();
		}
	}, [reload, active]);

	const getDadosDeficiencia = () => {
		if (empty(cdPessoaCandidato)) {
			return;
		}

		try {
			axiosInstance
				.get(`candidato/deficiencias/${cdPessoaCandidato}`)
				.then(function (response) {
					setDeficiencia(response.data);
				})
				.catch(function (error) {
					toast.error("Erro ao buscar deficiências.");
					console.error(error);
				});
		} catch (error) {
			console.error("Erro na comunicação com o back-end:", error);
		}
        setShowLoading(false);
	};

	const atualizaDeficienciasSelecionadas = (cdCid, checked) => {
		setDeficienciasSelecionadas((prevSelected) => {
			if (!checked) {
				return prevSelected.filter((id) => id !== cdCid);
			} else {
				return [...prevSelected, cdCid];
			}
		});
	};

	const gerarLaudo = () => {
		if (deficienciasSelecionadas.length < 1) {
			toast.error("Selecione pelo menos uma deficiência.");
			return;
		}

		var formLaudo = document.createElement("form");
		formLaudo.method = "POST";
		formLaudo.action = `${process.env.NEXT_PUBLIC_BASE_URL}/rhbsaas/recrutamento/cr_laudo_medico.php`;
		formLaudo.target = "_blank";
		formLaudo.style.display = "none";

		const paramsLaudo = {
			cd_pessoa_candidato: cdPessoaCandidato,
			origem: 'saas',
			check_id_cid_candidato: JSON.stringify(
				deficienciasSelecionadas
			),
		};

		Object.keys(paramsLaudo).forEach((key) => {
			const input = document.createElement("input");
			input.type = "hidden";
			input.name = key;
			input.value = paramsLaudo[key];
			formLaudo.appendChild(input);
		});

		document.body.appendChild(formLaudo);
		formLaudo.submit();
		document.body.removeChild(formLaudo);
	};

	const renderDeficiencia = () => {
		if (!deficiencia || deficiencia.length === 0) {
			return (
				<div className="pl-2 col-span-12">
					<div className="mb-4">
						<WarningMessage
							iconSize={33}
							className="!my-4"
							subTitle="Nenhuma deficiência encontrada!"
							text="As deficiências cadastradas no seu currículo serão listadas aqui."
						/>
					</div>
				</div>
			);
		}

		return Object.entries(deficiencia)
			.slice(0, 10)
			.map(([key, data]) => (
				<div key={data.ID_CID_CANDIDATO} className="pl-2 col-span-4">
					<Checkbox
						id={data.ID_CID_CANDIDATO}
						label={
							<div className="min-w-[280px] max-w-[285px] border border-gray-300 rounded-lg hover:bg-sky-50 hover:border-blue-200 m-2 p-2">
								<div className="text-md w-full font-bold truncate">
									{data.NM_TIPO_DEFICIENCIA}
								</div>
								<div className="text-md w-full truncate">
									CID: {data.CD_CID}
								</div>
								<div className="text-md w-full truncate">
									Criado em: {data.CRIADO_EM}
								</div>
							</div>
						}
						checked={deficienciasSelecionadas.includes(data.ID_CID_CANDIDATO)}
						onChange={(id, checked) =>
							atualizaDeficienciasSelecionadas(id, checked)
						}
					/>
				</div>
			));
	};

	if (!active) return null;

	return (
		<div
			id="gera_laudo_medico"
			className={`col-span-12 m-4 mt-14 relative`}
		>
			<Loading active={showLoading} className={"absolute"} />

			<div className="mt-4 px-4 rounded-t-md bg-primary text-white w-full text-sm font-semibold">
				<div className="pl-2 py-1">
					<Subtitle>Quais deficiências mostrar?</Subtitle>
				</div>
			</div>
			<div className="flex justify-center flex-wrap border border-gray-300 rounded-b-lg p-4">
				{renderDeficiencia()}
			</div>
            <div className="flex justify-center mt-4">
				<Button buttonType="primary" onClick={gerarLaudo}>
					<div className="flex items-center gap-2">
						<FontAwesomeIcon
							icon={faGear}
							width="15"
							height="15"
						/>
						<span>Gerar Laudo Médico</span>
					</div>
				</Button>
			</div>
		</div>
	);
};

export default GeraLaudoMedico;
