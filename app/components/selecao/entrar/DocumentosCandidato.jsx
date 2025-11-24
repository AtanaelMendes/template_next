import DataLoading from "@/components/Layouts/DataLoading";
import NoDataFound from "@/components/Layouts/NoDataFound";
import Title, { Caption, Subtitle } from "@/components/Layouts/Typography";
import axiosInstance from "@/plugins/axios";
import { useCallback, useEffect, useState } from "react";
import { format } from "@/assets/dateUtils";
import Button from "@/components/buttons/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePen } from "@fortawesome/free-solid-svg-icons";
import { cn, ellipsize, empty } from "@/assets/utils";
import DocumentosVagaCandidato from "@/components/selecao/entrar/DocumentosVagaCandidato";
import { useAppContext } from "@/context/AppContext";

function DocumentosCandidato({ active, reload, cdPessoaCandidato, nmCandidato }) {
    const { toast } = useAppContext();
    const [loading, setLoading] = useState(false);
    const [vagasComDocumentos, setVagasComDocumentos] = useState([]);
    const [vagaComDocumentoViewId, setVagaComDocumentoViewId] = useState(null);

    const getVagasComDocumentos = useCallback(async () => {
        setLoading(true);
        await axiosInstance
            .get(`candidato/documentos/${cdPessoaCandidato}`)
            .then((response) => {
                setVagasComDocumentos(response.data);
                setLoading(false);
            })
            .catch(function (error) {
                toast.error("Não foi possível carregar os documentos");
                console.error(error);
            });
    }, []);

    const VagasComDocumentoList = () => {
        if (empty(vagasComDocumentos)) return <NoDataFound />;

        return vagasComDocumentos.map((vaga) => {
            return (
                <div
                    className={cn(
                        "odd:bg-white even:bg-gray-100 hover:bg-drop-shadow-1 flex flex-row items-center gap-4 px-1",
                        vaga.NR_VAGA === vagaComDocumentoViewId
                            ? "border-2 border-primary"
                            : "border-l border-r"
                    )}
                    key={vaga.NR_VAGA}
                >
                    <div className="flex flex-row justify-between items-center text-sm py-1 w-full">
                        <div className="flex flex-col gap-2 w-60">
                            <span className="flex flex-row gap-1 items-center">
                                <Caption>Cargo:</Caption>
                                <Subtitle className="font-semibold text-neutral-600">
                                    {ellipsize(vaga.NM_CARGO, vagaComDocumentoViewId ? 15 : 25)}
                                </Subtitle>
                            </span>
                            <span className="flex flex-row gap-1 items-center">
                                <Caption>Unidade:</Caption>
                                <Subtitle className="font-medium text-neutral-600">
                                    {vaga.NM_UNIDADE}
                                </Subtitle>
                            </span>
                        </div>
                        <div className="flex flex-col gap-2 w-60">
                            <span className="flex flex-row gap-1 items-center">
                                <Caption>Cliente:</Caption>
                                <Subtitle className={"text-primary font-semibold"}>
                                    {ellipsize(vaga.NM_CLIENTE, vagaComDocumentoViewId ? 15 : 25)}
                                </Subtitle>
                            </span>
                            <span className="flex flex-row gap-1 items-center">
                                <Caption>Nr Vaga:</Caption>
                                <Subtitle className={"text-primary font-semibold"}>
                                    {vaga.NR_VAGA}
                                </Subtitle>
                            </span>
                        </div>
                        <div className="flex flex-col gap-2 w-60">
                            <span className="flex flex-row gap-1 items-center">
                                <Caption>Admissão:</Caption>
                                <Subtitle className={"font-medium italic text-neutral-600"}>
                                    {format(new Date(vaga.DT_ADMISSAO), "dd/MM/yyyy")}
                                </Subtitle>
                            </span>
                            <span className="flex flex-row gap-1 items-center">
                                <Caption>Demissão:</Caption>
                                <Subtitle className={"font-medium italic text-neutral-600"}>
                                    {vaga.DT_DEMISSAO
                                        ? format(new Date(vaga.DT_DEMISSAO), "dd/MM/yyyy")
                                        : "---------"}
                                </Subtitle>
                            </span>
                        </div>
                        <div className="flex flex-col gap-1 w-12 mr-4">
                            <Button
                                buttonType={"primary"}
                                outline
                                bordered
                                className={cn(
                                    "text-primary hover:text-white",
                                    vaga.NR_VAGA === vagaComDocumentoViewId &&
                                        "bg-primary text-white"
                                )}
                                size="small"
                                onClick={() => {
                                    setVagaComDocumentoViewId(vaga.NR_VAGA);
                                }}
                            >
                                <FontAwesomeIcon icon={faFilePen} width="18" height="18" />
                            </Button>
                        </div>
                    </div>
                </div>
            );
        });
    };

    useEffect(() => {
        getVagasComDocumentos();
    }, []);

    useEffect(() => {
        if (reload) getVagasComDocumentos();
    }, [reload]);

    if (!active) return null;

    return (
        <div className={`flex flex-row px-2 h-[550px] relative gap-2`}>
            <div className={cn("flex flex-col", vagaComDocumentoViewId ? "w-2/3" : "w-full")}>
                <div className={`flex flex-col bg-primary text-white rounded-t-md`}>
                    <div className="flex flex-row justify-between items-center">
                        <div className="flex flex-row items-center gap-1 p-2 w-full">
                            <Subtitle className={"pr-2"}>Documentos do Candidato</Subtitle>
                            <Title>{nmCandidato}</Title>
                        </div>
                        <div className="w-full text-sm flex justify-end p-2">
                            Exibindo {vagasComDocumentos.length} vaga(s) com documento(s)
                        </div>
                    </div>
                    <div className="flex bg-white">
                        <div className={`flex flex-col max-h-[60vh] overflow-y-auto w-full`}>
                            {loading ? (
                                <DataLoading />
                            ) : vagasComDocumentos.length <= 0 ? (
                                <NoDataFound />
                            ) : (
                                VagasComDocumentoList()
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {vagaComDocumentoViewId && (
                <DocumentosVagaCandidato
                    nrVaga={vagaComDocumentoViewId}
                    cdPessoaCandidato={cdPessoaCandidato}
                    setVagaComDocumentoViewId={setVagaComDocumentoViewId}
                />
            )}
        </div>
    );
}

export default DocumentosCandidato;
