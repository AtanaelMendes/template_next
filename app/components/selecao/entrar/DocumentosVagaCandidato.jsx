import Button from "@/components/buttons/Button";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useCallback, useEffect, useRef, useState } from "react";
import DocumentoRowCandidato from "@/components/selecao/entrar/DocumentoRowCandidato";
import NoDataFound from "@/components/Layouts/NoDataFound";
import DataLoading from "@/components/Layouts/DataLoading";
import axiosInstance, { axios } from "@/plugins/axios";
import { empty } from "@/assets/utils";

const DocumentosVagaCandidato = ({ setVagaComDocumentoViewId, nrVaga, cdPessoaCandidato }) => {
    const [documentos, setDocumentos] = useState([]);
    const [documentosWithInfo, setDocumentosWithInfo] = useState([]);
    const [loading, setLoading] = useState(false);
    const cancelSource = useRef(null);
    const cancelSourceInfo = useRef(null);

    const getDocumentos = useCallback(async () => {
        setLoading(true);
        await axiosInstance
            .get(`candidato/documentos-vaga/${cdPessoaCandidato}/${nrVaga}`, {
                cancelToken: cancelSource.current.token,
            })
            .then((response) => {
                if (response.status === 200) {
                    setDocumentos(response.data);
                }
            })
            .catch((error) => {
                if (!axios.isCancel(error)) {
                    console.error(error);
                }
            });
    }, [nrVaga, cdPessoaCandidato]);

    const getDocumentosInfo = useCallback(async () => {
        if (!Array.isArray(documentos) || documentos.length === 0) {
            return;
        }

        const ids = documentos.map((doc) => doc.DOCUMENTO_ID);
        const queryParams = ids.map((id) => `ids[]=${id}`).join("&");

        await axiosInstance
            .get(`autentique/documentos?${queryParams}`, {
                cancelToken: cancelSourceInfo.current.token,
            })
            .then((response) => {
                if (response.status === 200) {
                    setDocumentosWithInfo(response.data);
                    setLoading(false);
                }
            })
            .catch((error) => {
                if (!axios.isCancel(error)) {
                    console.error(error);
                }
            });
    }, [documentos]);

    const DocumentoList = () => {
        let idx = 0;

        if (empty(documentosWithInfo)) {
            return <NoDataFound />;
        }

        return documentosWithInfo.map((doc) => {
            const documentoLike = documentos.find((documento) => documento.DOCUMENTO_ID === doc.id);
            const indexProrrogacao = documentoLike?.TIPO_DOC === "P" ? ++idx : 0;
            return (
                <DocumentoRowCandidato
                    key={doc.id}
                    docInfo={doc}
                    documento={documentoLike}
                    indexProrrogacao={indexProrrogacao}
                />
            );
        });
    };

    useEffect(() => {
        cancelSource.current = axios.CancelToken.source();
        (async () => await getDocumentos())();

        return () => {
            cancelSource.current.cancel();
        };
    }, [nrVaga]);

    useEffect(() => {
        cancelSourceInfo.current = axios.CancelToken.source();

        if (documentos.length > 0) {
            (async () => await getDocumentosInfo())();
        }

        return () => {
            cancelSourceInfo.current.cancel();
        };
    }, [documentos]);

    return (
        <div className="flex flex-col w-1/3 shadow">
            <div className="flex flex-row justify-between bg-blue-600 py-1 pl-2 pr-1 rounded-t-lg">
                <span className="italic text-white">Documentos vaga - {nrVaga}</span>
                <Button
                    className={`hover:bg-drop-shadow-2 text-white`}
                    size="small"
                    pill
                    onClick={() => {
                        setVagaComDocumentoViewId(null);
                    }}
                >
                    <FontAwesomeIcon icon={faClose} width="16" height="16" />
                </Button>
            </div>
            <div className="flex flex-col">
                {loading ? <DataLoading /> : documentosWithInfo ? DocumentoList() : <NoDataFound />}
            </div>
        </div>
    );
};

export default DocumentosVagaCandidato;
