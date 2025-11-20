import { useCallback, useEffect, useRef, useState } from "react";
import FabAdd from "@/components/buttons/FloatActionButton";
import Timeline from "@/components/Layouts/Timeline";
import Loading from "@/components/Layouts/Loading";
import Dialog from "@/components/Layouts/Dialog";
import { useAppContext } from "@/context/AppContext";
import axiosInstance from "@/plugins/axios";
import { cn } from "@/assets/utils";

const HistoricoCandidato = ({
	active,
	reload,
	cdPessoaCandidato,
	nmCandidato,
	className
}) => {
	const [controlInsertStory, setControlInsertStory] = useState(false);
	const [timelineData, setTimelineData] = useState([]);
	const { toast, user } = useAppContext();
	const [loading, setLoading] = useState(false);
	const [rawData, setRawData] = useState([]);
	const divStory = useRef();

	const insertHistorico = (dsHistorico) => {
		setLoading(true);

		axiosInstance
			.post(`candidato/timeline`, {
				ds_historico: dsHistorico,
				cd_pessoa_candidato: cdPessoaCandidato,
				cd_usuario: user.user_sip,
			})
			.then(function (response) {
				setLoading(false);
				toast.success("Novo histórico inserido");
				getHistoricoCandidato();
				scrollToTop();
			})
			.catch(function (error) {
				setLoading(false);
				toast.error("Não foi possível inserir o histórico");
				console.error(error);
			});
	};

	const getHistoricoCandidato = () => {
		setLoading(true);

		axiosInstance
			.get(`candidato/timeline/${cdPessoaCandidato}`)
			.then(function (response) {
				setLoading(false);
				setRawData(response.data || []);
			})
			.catch(function (error) {
				setLoading(false);
				console.error(error);
			});
	};

	useEffect(() => {
		if (active && cdPessoaCandidato) {
			getHistoricoCandidato();
		}
	}, [active, cdPessoaCandidato]);

	useEffect(() => {
		if (active && reload && cdPessoaCandidato) {
			getHistoricoCandidato();
		}
	}, [reload, active, cdPessoaCandidato]);

	useEffect(() => {
		setTimelineData(
			rawData.map((row) => {
				return {
					title: row.NM_USUARIO,
					time: row.DT_HISTORICO,
					description: row.DS_OBSERVACOES,
				};
			})
		);
	}, [rawData]);

	function scrollToTop() {
		divStory.current.scrollTop = 0;
		let timeline = divStory.current.querySelector("ol");
		let firstLi = timeline.querySelector("li:first-child");
		if (firstLi) {
			firstLi.classList.add("bg-green-300");
		}
		setTimeout(() => {
			firstLi.classList.remove("bg-green-300");
		}, 1000);
	}

	if (!active) return null;

	return (
		<div
			className={cn(`grid grid-cols-12 rounded bg-white pr-1 relative`, className || 'm-4 mt-14')}
		>
			<Loading active={loading} />
			<div className="col-span-12 bg-blue-600 py-1 pl-2 pr-1 rounded-t-lg h-8">
				<div className="grid grid-cols-12">
					<div className="col-span-11 text-white">
						<span className="font-semibold text-sm">
							Histórico do candidato {nmCandidato}
						</span>
					</div>
				</div>
			</div>
			<div className={"absolute bottom-[70px] right-[80px]"}>
				<Dialog
					maxLength={2000}
					textAreaLabel={" "}
					btnAccept={"SALVAR"}
					btnCancel={"CANCELAR"}
					textAreaMinLength={20}
					title={`Inserir histórico`}
					showDialog={controlInsertStory}
					setDialogControl={setControlInsertStory}
					confirmActionCallback={(description) => {
						insertHistorico(description);
					}}
				/>
			</div>
			<div
				className="col-span-12 pl-4 pt-2 max-h-[550px] overflow-y-auto"
				ref={divStory}
			>
				<Timeline data={timelineData} />
			</div>
			<div className={"fixed bottom-[70px] right-[80px]"}>
				<FabAdd
					onClick={() => {
						setControlInsertStory(true);
					}}
				/>
			</div>
		</div>
	);
};
export default HistoricoCandidato;
