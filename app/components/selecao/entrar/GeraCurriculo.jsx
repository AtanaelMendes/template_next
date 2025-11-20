import { FieldLabel, Subtitle } from "@/components/Layouts/Typography";
import WarningMessage from "@/components/Layouts/WarningMessage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect, useCallback, useMemo } from "react";
import ButtonToggle from "@/components/buttons/ButtonToggle";
import { faGear } from "@fortawesome/free-solid-svg-icons";
import Checkbox from "@/components/inputs/Checkbox";
import Button from "@/components/buttons/Button";
import Select from "@/components/inputs/Select";
import { useAppContext } from "@/context/AppContext";
import { cn, empty } from "@/assets/utils";
import axiosInstance from "@/plugins/axios";

const GeraCurriculo = ({
	active,
	reload,
	cdPessoaCandidato,
	className,
	refreshList,
	nrVaga,
}) => {
	const { toast, user } = useAppContext();
	const cdUnidade = parseInt(user.cd_unid);

	const defaultFields = {
		identificar_candidato: "S",
		mostrar_documentos: "N",
		emite_parecer: "S",
		mostrar_perfil: "N",
		curriculo_logo: "S",
		curriculo_marca: "N",
		mostrar_deficiencia: "N",
		cd_cargo: "",
		mostrar_motivo_saida: "N",
		mostrar_layout: [1, 19, 330, 430].includes(cdUnidade)
			? cdUnidade === 330
				? 2
				: 1
			: 1,
		mostrar_pretensao_salarial: "S",
		gerar_laudo: "N",
		mostrar_dados_pessoais: "S",
		gerar_laudo_medico: "N",
		mostrar_foto: "N",
		ultimo_salario: "N",
		mostrar_uniforme: "N",
		mostrar_turnos_pretendidos: "S",
	};

	const [empregosSelecionados, setEmpregosSelecionados] = useState([]);
	const [opcoesCargos, setOpcoesCargos] = useState([]);
	const [empregos, setEmpregos] = useState([]);
	const [deficienciasSelecionadas, setDeficienciasSelecionadas] = useState(
		[]
	);
	const [deficiencia, setDeficiencia] = useState([]);
	const [showDeficiencias, setShowDeficiencias] = useState(false);

	const layoutOptions = useMemo(() => {
		const options = [{ label: "RHBrasil", value: 1 }];

		if ([1, 19, 330, 430].includes(cdUnidade)) {
			options.push({ label: "Dream Job", value: 2 });
		}

		return options;
	}, []);

	const [dadosCurriculo, setDadosCurriculo] = useState(defaultFields);

	const setDadosCurriculoCallback = useCallback((id, value) => {
		setDadosCurriculo((prevState) => ({ ...prevState, [id]: value }));
	});

	const atualizaEmpregosSelecionados = (nrSequencia, checked) => {
		setEmpregosSelecionados((prevSelected) => {
			if (!checked) {
				return prevSelected.filter((id) => id !== nrSequencia);
			} else {
				return [...prevSelected, nrSequencia];
			}
		});
	};

	const setCurriculoGerado = (nrVaga, cdPessoaCandidato) => {
		axiosInstance
			.post(
				`candidato/aprova-candidato-estagio-vaga/${nrVaga}/${cdPessoaCandidato}/4`
			)
			.then(function (response) {
				if (response.data.status == 0) {
					toast.error(response.data.msg);
					return;
				}

				toast.success(response.data.msg);
				refreshList();
			})
			.catch(function (resp) {
				let error = resp?.response?.data?.error;

				if (Array.isArray(error)) {
					return toast.error(
						error.join(" ") ||
							"OOps ocorreu um erro ao buscar os dados da vaga"
					);
				}
				return toast.error(
					error || "OOps ocorreu um erro ao buscar os dados da vaga"
				);
			});
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

	const getCargosCandidato = () => {
		if (empty(cdPessoaCandidato)) {
			return;
		}

		try {
			axiosInstance
				.get(`candidato/cargos/${cdPessoaCandidato}`)
				.then(function (response) {
					const cargosArray = response.data.map((item, index) => {
						return { label: item.NM_CARGO, value: item.CD_CARGO };
					});

					setDadosCurriculoCallback(
						"cd_cargo",
						cargosArray[0]["value"]
					);
					setOpcoesCargos(cargosArray || []);
				})
				.catch(function (error) {
					toast.error("Erro ao buscar cargos do candidato.");
					console.error(error);
				});
		} catch (error) {
			console.error("Erro na comunicação com o back-end:", error);
		}
	};

	const getDadosEmprego = () => {
		if (empty(cdPessoaCandidato)) {
			return;
		}

		try {
			axiosInstance
				.get(`candidato/empregos/${cdPessoaCandidato}`)
				.then(function (response) {
					const qtd =
						response.data.length < 3 ? response.data.length : 3;
					const tempEmpregos = Object.entries(response.data).slice(
						0,
						qtd
					);
					let empregosSelPadrao = [];

					tempEmpregos.forEach(([key, data]) => {
						empregosSelPadrao.push(data.NR_SEQUENCIA);
					});

					setEmpregosSelecionados(empregosSelPadrao);
					setEmpregos(response.data);
				})
				.catch(function (error) {
					toast.error("Erro ao buscar empregos.");
					console.error(error);
				});
		} catch (error) {
			console.error("Erro na comunicação com o back-end:", error);
		}
	};

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
	};

	const gerarCurriculo = () => {
		let data = {
			...dadosCurriculo,
			cd_usuario: btoa(user.user_sip),
			cd_pessoa_candidato: btoa(cdPessoaCandidato),
			empregos: empregosSelecionados.join(),
			check_id_cid_candidato: JSON.stringify(deficienciasSelecionadas),
		};

		let fileName = "curriculo_rhbrasil.php";
		if (dadosCurriculo.mostrar_layout == 2) {
			fileName = "curriculo_dream_job.php";
		}

		const formCurriculo = document.createElement("form");
		formCurriculo.method = "POST";
		formCurriculo.action = `${process.env.NEXT_PUBLIC_BASE_URL}/saas_api/app/Utils/${fileName}`;
		formCurriculo.target = "geracurriculowindow";
		formCurriculo.style.display = "none";

		Object.keys(data).forEach((key) => {
			const input = document.createElement("input");
			input.type = "hidden";
			input.name = key;
			input.value = data[key];
			formCurriculo.appendChild(input);
		});

		document.body.appendChild(formCurriculo);

		const report = window.open("", "geracurriculowindow");

		if (report) {
			formCurriculo.submit();
			document.body.removeChild(formCurriculo);
		} else {
			alert(
				"Necessário permitir os pop-ups da página para gerar o currículo"
			);
		}
	};

	const getDateDiffString = (dataInicio, dataFim) => {
		if (!dataInicio.isValid() || !dataFim.isValid()) {
			return "Período inválido";
		}

		const duration = moment.duration(dataFim.diff(dataInicio));
		const years = duration.years();
		const months = duration.months();

		const yearText = years ? `${years} ${years > 1 ? "anos" : "ano"}` : "";
		const monthText = months
			? `${months} ${months > 1 ? "meses" : "mês"}`
			: "";
		const separator = years && months ? " e " : "";

		return `${yearText}${separator}${monthText}` || "Período inválido";
	};

	const renderEmpregos = () => {
		if (empregos.length == 0) {
			return (
				<div className={"pl-2 col-span-12"}>
					<div className={"mb-4"}>
						<WarningMessage
							iconSize={33}
							className={"!my-4"}
							subTitle={"Nenhum emprego encontrado!"}
							text={
								"Os empregos cadastrados no seu curriculo serão listados aqui."
							}
						/>
					</div>
				</div>
			);
		}

		let objTeste = [];
		const listaEmpregos = Object.entries(empregos).slice(0, 10);

		listaEmpregos.forEach(([key, data]) => {
			let dataInicio = moment(data.DT_INICIO, "YYYY-MM-DD");
			let dataFim = moment();
			let dataFimString = "Atual";
			const nrSequencia = data.NR_SEQUENCIA;
			const selected = empregosSelecionados.includes(nrSequencia);

			if (!empty(data.DT_FIM)) {
				dataFim = moment(data.DT_FIM, "YYYY-MM-DD");
				dataFimString = dataFim.format("DD/MM/YYYY");
			}

			const periodo = getDateDiffString(dataInicio, dataFim);
			objTeste.push(
				<div className={"pl-2 col-span-4"} key={key}>
					<Checkbox
						id={nrSequencia}
						label={
							<div
								className={`min-w-[280px] max-w-[285px] border ${
									selected
										? "border-2 border-blue-300 bg-sky-50"
										: "border-gray-300"
								} rounded-lg hover:bg-sky-50 hover:border-blue-200 m-2 p-2`}
							>
								<div className="text-md w-full">
									<span className="block truncate font-bold">
										{data.NM_PESSOA_EMPRESA}
									</span>
								</div>
								<span className="block truncate font-semibold italic">
									{data.NM_CARGO}
								</span>
								<div className="flex font-normal items-center text-md w-full">
									<span>Período:</span>
									<span className="pl-2 font-semibold">{`${dataInicio.format(
										"DD/MM/YYYY"
									)} a ${dataFimString}`}</span>
								</div>
								<div className="flex font-normal items-center text-md w-full">
									<span>Duração:</span>
									<span className="pl-2 font-semibold">
										{periodo}
									</span>
								</div>
							</div>
						}
						checked={empregosSelecionados.includes(nrSequencia)}
						onChange={(id, checked) =>
							atualizaEmpregosSelecionados(id, checked)
						}
					/>
				</div>
			);
		});

		return objTeste;
	};

	const renderDeficiencia = () => {
		if (deficiencia.length == 0) {
			return (
				<div className={"pl-2 col-span-12"}>
					<div className={"mb-4"}>
						<WarningMessage
							iconSize={33}
							className={"!my-4"}
							subTitle={"Nenhuma deficiência encontrada!"}
							text={
								"As deficiências cadastradas no seu curriculo serão listadas aqui."
							}
						/>
					</div>
				</div>
			);
		}

		let objTeste = [];
		const listaDeficiencia = Object.entries(deficiencia).slice(0, 10);

		listaDeficiencia.forEach(([key, data]) => {
			objTeste.push(
				<div
					className={"pl-2 col-span-4"}
					key={key}
				>
					<Checkbox
						id={data.ID_CID_CANDIDATO}
						label={
							<div
								className={`min-w-[280px] max-w-[285px] border border-gray-300 rounded-lg hover:bg-sky-50 hover:border-blue-200 m-2 p-2`}
							>
								<div className="text-md w-full">
									<span className="block truncate font-bold">
										{data.NM_TIPO_DEFICIENCIA}
									</span>
								</div>
								<div className="text-md w-full">
									<span className="block truncate">
										CID: {data.CD_CID}
									</span>
								</div>
								<div className="text-md w-full">
									<span className="block truncate">
										Criado em: {data.CRIADO_EM}
									</span>
								</div>
							</div>
						}
						checked={deficienciasSelecionadas.includes(
							data.ID_CID_CANDIDATO
						)}
						onChange={(id, checked) =>
							atualizaDeficienciasSelecionadas(id, checked)
						}
					/>
				</div>
			);
		});

		return objTeste;
	};

	const handleDeficiencia = (checked) => {
		setShowDeficiencias(checked);
	};

	useEffect(() => {
		if (active) {
			getCargosCandidato();
			getDadosEmprego();
			getDadosDeficiencia();
		}
	}, [reload, active]);

	if (!active) return null;

	return (
		<div className="col-span-12 overflow-y-scroll max-h-[calc(100vh-50px)]">
			<div className={cn("flex flex-col p-4 relative h-max", className)}>
				<div className="px-4 rounded-t-md bg-primary text-white w-full text-sm font-semibold">
					<div className="pl-2 py-1">
						<Subtitle>Definições currículo</Subtitle>
					</div>
				</div>

				<div className="flex flex-wrap gap-4 border border-gray-300 rounded-b-lg p-4">
					<div className="flex flex-wrap w-full gap-4">
						<div className="flex flex-col flex-1 basis-[calc(50%-1rem)] lg:basis-[calc(25%-1rem)]">
							<FieldLabel>Identificar candidato:</FieldLabel>
							<ButtonToggle
								primary
								labelOn="Sim"
								LabelOff="Não"
								id="identificar_candidato"
								checked={
									dadosCurriculo.identificar_candidato == "S"
								}
								onChange={(id, value, checked) =>
									setDadosCurriculoCallback(
										id,
										checked ? "S" : "N"
									)
								}
							/>
						</div>

						<div className="flex flex-col flex-1 basis-[calc(50%-1rem)] lg:basis-[calc(25%-1rem)]">
							<FieldLabel>Mostrar documentos:</FieldLabel>
							<ButtonToggle
								primary
								labelOn="Sim"
								LabelOff="Não"
								id="mostrar_documentos"
								checked={
									dadosCurriculo.mostrar_documentos == "S"
								}
								onChange={(id, value, checked) =>
									setDadosCurriculoCallback(
										id,
										checked ? "S" : "N"
									)
								}
							/>
						</div>

						<div className="flex flex-col flex-1 basis-[calc(50%-1rem)] lg:basis-[calc(25%-1rem)]">
							<FieldLabel>Emite parecer:</FieldLabel>
							<ButtonToggle
								primary
								labelOn={"Sim"}
								LabelOff={"Não"}
								id={"emite_parecer"}
								checked={dadosCurriculo.emite_parecer == "S"}
								onChange={(id, value, checked) =>
									setDadosCurriculoCallback(
										id,
										checked ? "S" : "N"
									)
								}
							/>
						</div>
						<div className="flex flex-col flex-1 basis-[calc(50%-1rem)] lg:basis-[calc(25%-1rem)]">
							<FieldLabel>Mostrar perfil:</FieldLabel>
							<ButtonToggle
								primary
								labelOn={"Sim"}
								LabelOff={"Não"}
								id={"mostrar_perfil"}
								checked={dadosCurriculo.mostrar_perfil == "S"}
								onChange={(id, value, checked) =>
									setDadosCurriculoCallback(
										id,
										checked ? "S" : "N"
									)
								}
							/>
						</div>
						<div className="flex flex-col flex-1 basis-[calc(50%-1rem)] lg:basis-[calc(25%-1rem)]">
							<FieldLabel>Exibir logo:</FieldLabel>
							<ButtonToggle
								primary
								labelOn={"Sim"}
								LabelOff={"Não"}
								id={"curriculo_logo"}
								checked={dadosCurriculo.curriculo_logo == "S"}
								onChange={(id, value, checked) =>
									setDadosCurriculoCallback(
										id,
										checked ? "S" : "N"
									)
								}
							/>
						</div>
						<div className="flex flex-col flex-1 basis-[calc(50%-1rem)] lg:basis-[calc(25%-1rem)]">
							<FieldLabel>Mostrar marca d'agua:</FieldLabel>
							<ButtonToggle
								primary
								labelOn={"Sim"}
								LabelOff={"Não"}
								id={"curriculo_marca"}
								checked={dadosCurriculo.curriculo_marca == "S"}
								onChange={(id, value, checked) =>
									setDadosCurriculoCallback(
										id,
										checked ? "S" : "N"
									)
								}
							/>
						</div>
						<div className="flex flex-col flex-1 basis-[calc(50%-1rem)] lg:basis-[calc(25%-1rem)]">
							<FieldLabel>Mostrar deficiência:</FieldLabel>
							<ButtonToggle
								primary
								labelOn={"Sim"}
								LabelOff={"Não"}
								id={"mostrar_deficiencia"}
								checked={
									dadosCurriculo.mostrar_deficiencia == "S"
								}
								onChange={(id, value, checked) =>
									setDadosCurriculoCallback(
										id,
										checked ? "S" : "N"
									)
								}
							/>
						</div>
						<div className="flex flex-col flex-1 basis-[calc(50%-1rem)] lg:basis-[calc(25%-1rem)]">
							<FieldLabel>Mostrar dados pessoais:</FieldLabel>
							<ButtonToggle
								primary
								labelOn={"Sim"}
								LabelOff={"Não"}
								id={"mostrar_dados_pessoais"}
								checked={
									dadosCurriculo.mostrar_dados_pessoais == "S"
								}
								onChange={(id, value, checked) =>
									setDadosCurriculoCallback(
										id,
										checked ? "S" : "N"
									)
								}
							/>
						</div>
						<div className="flex flex-col flex-1 basis-[calc(50%-1rem)] lg:basis-[calc(25%-1rem)]">
							<FieldLabel>Gerar laudo médico:</FieldLabel>
							<ButtonToggle
								primary
								labelOn={"Sim"}
								LabelOff={"Não"}
								id={"gerar_laudo_medico"}
								checked={
									dadosCurriculo.gerar_laudo_medico == "S"
								}
								onChange={(id, value, checked) => {
									setDadosCurriculoCallback(
										id,
										checked ? "S" : "N"
									);
									handleDeficiencia(checked);
								}}
							/>
						</div>
						<div className="flex flex-col flex-1 basis-[calc(50%-1rem)] lg:basis-[calc(25%-1rem)]">
							<FieldLabel>Mostrar foto:</FieldLabel>
							<ButtonToggle
								primary
								labelOn={"Sim"}
								LabelOff={"Não"}
								id={"mostrar_foto"}
								checked={dadosCurriculo.mostrar_foto == "S"}
								onChange={(id, value, checked) =>
									setDadosCurriculoCallback(
										id,
										checked ? "S" : "N"
									)
								}
							/>
						</div>
						<div className="flex flex-col flex-1 basis-[calc(50%-1rem)] lg:basis-[calc(25%-1rem)]">
							<FieldLabel>Mostrar uniforme:</FieldLabel>
							<ButtonToggle
								primary
								labelOn={"Sim"}
								LabelOff={"Não"}
								id={"mostrar_uniforme"}
								checked={dadosCurriculo.mostrar_uniforme == "S"}
								onChange={(id, value, checked) =>
									setDadosCurriculoCallback(
										id,
										checked ? "S" : "N"
									)
								}
							/>
						</div>
						<div className="flex flex-col flex-1 basis-[calc(50%-1rem)] lg:basis-[calc(25%-1rem)]">
							<FieldLabel>Mostrar turnos pretendidos:</FieldLabel>
							<ButtonToggle
								primary
								labelOn={"Sim"}
								LabelOff={"Não"}
								id={"mostrar_turnos_pretendidos"}
								checked={
									dadosCurriculo.mostrar_turnos_pretendidos ==
									"S"
								}
								onChange={(id, value, checked) =>
									setDadosCurriculoCallback(
										id,
										checked ? "S" : "N"
									)
								}
							/>
						</div>
						<div className="flex flex-col flex-1 basis-[calc(50%-1rem)] lg:basis-[calc(25%-1rem)]">
							<FieldLabel>Mostrar pretensão salarial:</FieldLabel>
							<ButtonToggle
								primary
								labelOn={"Sim"}
								LabelOff={"Não"}
								id={"mostrar_pretensao_salarial"}
								checked={
									dadosCurriculo.mostrar_pretensao_salarial ==
									"S"
								}
								onChange={(id, value, checked) =>
									setDadosCurriculoCallback(
										id,
										checked ? "S" : "N"
									)
								}
							/>
						</div>
						<div className="flex flex-col flex-1 basis-[calc(50%-1rem)] lg:basis-[calc(25%-1rem)]">
							<FieldLabel>Último salário:</FieldLabel>
							<ButtonToggle
								primary
								labelOn={"Sim"}
								LabelOff={"Não"}
								id={"ultimo_salario"}
								checked={dadosCurriculo.ultimo_salario == "S"}
								onChange={(id, value, checked) =>
									setDadosCurriculoCallback(
										id,
										checked ? "S" : "N"
									)
								}
							/>
						</div>
						<div className="flex flex-col flex-1 basis-[calc(50%-1rem)] lg:basis-[calc(25%-1rem)]">
							<FieldLabel>Mostrar motivo saída:</FieldLabel>
							<ButtonToggle
								primary
								labelOn={"Sim"}
								LabelOff={"Não"}
								id={"mostrar_motivo_saida"}
								checked={
									dadosCurriculo.mostrar_motivo_saida == "S"
								}
								onChange={(id, value, checked) =>
									setDadosCurriculoCallback(
										id,
										checked ? "S" : "N"
									)
								}
							/>
						</div>

						<div className="flex flex-col flex-1 basis-[calc(50%-1rem)] lg:basis-[calc(25%-1rem)]">
							<Select
								options={layoutOptions}
								hideClearButton
								id="mostrar_layout"
								label="Layout currículo:"
								value={dadosCurriculo.mostrar_layout}
								onChange={(id, value) =>
									setDadosCurriculoCallback(id, value)
								}
							/>
						</div>

						<div className="flex flex-col flex-1 basis-[calc(50%-1rem)] lg:basis-[calc(25%-1rem)]">
							<Select
								hideClearButton
								id="cd_cargo"
								label="Cargo:"
								options={opcoesCargos}
								value={dadosCurriculo.cd_cargo}
								onChange={(id, value) =>
									setDadosCurriculoCallback(id, value)
								}
							/>
						</div>

						<div className="flex flex-col flex-1 basis-[calc(50%-1rem)] lg:basis-[calc(25%-1rem)]">
							<Select
								options={[
									{ label: "Padrão", value: "padrao" },
									{ label: "Embraco", value: "embraco" },
									{ label: "Não", value: "N" },
								]}
								hideClearButton
								id="gerar_laudo"
								label="Gerar laudo:"
								value={dadosCurriculo.gerar_laudo}
								onChange={(id, value) =>
									setDadosCurriculoCallback(id, value)
								}
							/>
						</div>
					</div>
				</div>

				<div className="mt-4 px-4 rounded-t-md bg-primary text-white w-full text-sm font-semibold">
					<div className="pl-2 py-1">
						<Subtitle>Quais empregos mostrar?</Subtitle>
					</div>
				</div>

				<div className="flex justify-center flex-wrap border border-gray-300 rounded-b-lg p-4">
					{renderEmpregos()}
				</div>

				{showDeficiencias && (
					<>
						<div className="mt-4 px-4 rounded-t-md bg-primary text-white w-full text-sm font-semibold">
							<div className="pl-2 py-1">
								<Subtitle>Quais deficiências mostrar?</Subtitle>
							</div>
						</div>

						<div className="flex justify-center flex-wrap border border-gray-300 rounded-b-lg p-4">
							{renderDeficiencia()}
						</div>
					</>
				)}

				<div className="flex justify-center mt-4">
					<Button buttonType="primary" onClick={gerarCurriculo}>
						<div className="flex items-center gap-2">
							<FontAwesomeIcon
								icon={faGear}
								width="15"
								height="15"
							/>
							<span>Gerar currículo</span>
						</div>
					</Button>
				</div>
			</div>
		</div>
	);
};

export default GeraCurriculo;
