import { useEffect, useState } from "react";
import Button from "@/components/buttons/Button";
import axiosInstance from "@/plugins/axios";
import { useAppContext } from "@/context/AppContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faX, faXmark } from "@fortawesome/free-solid-svg-icons";
import VagaResumida from "@/components/candidatos/VagaResumida";

const ReciclarCandidato = ({
	cdPessoaCandidato,
	onSuccess,
    dataAgenda,
}) => {
	const { toast } = useAppContext();
	const [vagas, setVagas] = useState([]);
	const [loading, setLoading] = useState(false);
	const [nrVagaOnView, setNrVagaOnView] = useState("");
	const [flippedCards, setFlippedCards] = useState({});

	let timeoutIdVaga = null;

	useEffect(() => {
		if (!cdPessoaCandidato) return;

		setLoading(true);
		axiosInstance
			.get(`/recrutamento/vagas-reciclagem/${cdPessoaCandidato}`)
			.then((resp) => {
				if (resp.data && resp.data.length > 0) {
					setVagas(resp.data);
				} else {
					toast.info("Nenhuma vaga encontrada para o candidato.");
				}
			})
			.catch((err) => {
				console.error(err);
				toast.error("Erro ao buscar vagas.");
			})
			.finally(() => setLoading(false));
	}, [cdPessoaCandidato]);

	const vagaResumidaCallback = () => {
		setNrVagaOnView("");
	};

	const handleMouseEnterVaga = (nrVaga) => {
		if (flippedCards[nrVaga]) return;
		timeoutIdVaga = setTimeout(() => {
			setNrVagaOnView(nrVaga);
		}, 1000);
	};

	const handleMouseLeaveVaga = () => {
		clearTimeout(timeoutIdVaga);
	};

	const toggleFlip = (nrVaga) => {
		setFlippedCards((prev) => ({
			...prev,
			[nrVaga]: !prev[nrVaga],
		}));
	};

	const encaminharVaga = (nrRequisicao) => {
		axiosInstance
			.post("/recrutamento/reaproveita-candidato", {
				cd_pessoa_candidato: cdPessoaCandidato,
				nr_requisicao: nrRequisicao,
                data_agenda: dataAgenda,
			})
			.then(() => {
				toast.success("Candidato reciclado com sucesso.");
				onSuccess?.();
			})
			.catch((err) => {
				console.error(err);
				toast.error("Erro ao reciclar o candidato.");
			});
	};

    const baixarVagas = (cdPessoaCandidato, dataAgenda) => {
        axiosInstance
            .post("/recrutamento/baixa-agenda-candidato", {
                cd_pessoa_candidato: cdPessoaCandidato,
                data_agenda: dataAgenda,
            })
            .then(() => {
                toast.success("Vagas baixadas com sucesso.");
                onSuccess?.();
            })
            .catch((err) => {
                console.error(err);
                toast.error("Erro ao baixar vagas.");
            });
    };


	if (loading) return <div className="p-4">Carregando vagas...</div>;

	if (vagas.length === 0) {
		return (
			<div className="p-4 text-center text-gray-600">
				<strong>Não há vagas</strong> no perfil do candidato.
			</div>
		);
	}

	return (
		<div className="p-4">
			<style jsx>{`
				.flip-container {
					perspective: 1000px;
				}
				.flip-inner {
					position: relative;
					width: 100%;
					height: 100%;
					transition: transform 0.6s;
					transform-style: preserve-3d;
				}
				.flip-inner.flipped {
					transform: rotateY(180deg);
				}
				.flip-front,
				.flip-back {
					position: absolute;
					width: 100%;
					height: 100%;
					backface-visibility: hidden;
					border-radius: 0.75rem;
				}
				.flip-back {
					transform: rotateY(180deg);
				}
			`}</style>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto pr-2">
				{vagas.map((vaga) => (
					<div
						key={vaga.NR_VAGA}
						onClick={() => toggleFlip(vaga.NR_VAGA)}
						className="flip-container h-[220px] cursor-pointer "
					>
						<div
							className={`flip-inner ${
								flippedCards[vaga.NR_VAGA] ? "flipped" : ""
							}`}
						>
                            <div className="flip-front bg-white border border-gray-300 shadow-sm p-3">
                                <div className="font-semibold text-primary">
                                    <span
                                        onMouseEnter={() => handleMouseEnterVaga(vaga.NR_VAGA)}
                                        onMouseLeave={handleMouseLeaveVaga}
                                    >
                                        {vaga.NM_CARGO_CLIENTE + " - " + vaga.NR_VAGA}
                                    </span>
                                </div>
                                <div className="mt-1 text-sm text-gray-600 line-clamp-5">
                                    <strong>Descrição: </strong>
                                    {vaga.DS_OBS_INTERNET}
                                </div>
                            </div>
							<div className="flip-back bg-green-100 border border-green-400 flex flex-col items-center justify-center text-center p-3">
								<span className="text-center text-sm mb-4">
									Tem certeza que gostaria de reciclar o candidato?
								</span>
								<div className="flex gap-2">
									<Button
										buttonType="danger"
										className="ml-2"
										onClick={() =>
											handleMouseEnterVaga(vaga.NR_VAGA)
										}
									>
										<FontAwesomeIcon
											icon={faXmark}
											className="mr-1"
                                            height={16}
                                            width={16}
										/>
									</Button>

									<Button
										buttonType="success"
										className="ml-2"
										onClick={() =>
											encaminharVaga(vaga.NR_REQUISICAO)
										}
									>
										<FontAwesomeIcon
											icon={faCheck}
											className="mr-1"
                                            height={16}
                                            width={16}
										/>
									</Button>
								</div>
							</div>
						</div>
					</div>
				))}
			</div>

			<div className="text-center mt-4">
				<Button
					buttonType="danger"
					onClick={() =>
                        baixarVagas(cdPessoaCandidato, dataAgenda)
					}
				>
					Não tem interesse ou não está no perfil
				</Button>
			</div>

			<VagaResumida
				mostrarPerfil={true}
				nrVaga={nrVagaOnView}
				closeCallback={vagaResumidaCallback}
			/>
		</div>
	);
};

export default ReciclarCandidato;
