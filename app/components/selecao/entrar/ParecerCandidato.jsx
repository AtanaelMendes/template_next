import FabAdd from "@/components/buttons/FloatActionButton";
import Accordion from "@/components/Layouts/Accordion";
import React, { useState, useEffect } from "react";
import Loading from "@/components/Layouts/Loading";
import Dialog from "@/components/Layouts/Dialog";
import { useAppContext } from "@/context/AppContext";
import NoDataFound from "@/components/Layouts/NoDataFound";
import axiosInstance from "@/plugins/axios";

const ParecerCandidato = ({ cdPessoa }) => {
    const [itensParecer, setItensParecer] = useState([]);
    const [showDialog, setShowDialog] = useState(false);
    const { toast, user } = useAppContext();
    const [loading, setLoading] = useState(false);
    const [rawData, setRawData] = useState([]);

    const getListaParecerCandidato = () => {
        try {
            axiosInstance
                .get(`candidato/lista-parecer/${cdPessoa}`)
                .then(function (response) {
                    setRawData(response.data || []);
                })
                .catch(function (error) {
                    toast.error("Erro ao buscar o parecer do candidato.");
                    console.error(error);
                });
        } catch (error) {
            console.error("Erro na comunicação com o back-end:", error);
        }
    };

    const inserirParecer = (description) => {
        setLoading(true);
        axiosInstance
            .post(`candidato/inserir-parecer`, {
                ds_observacoes: description,
                cd_pessoa_candidato: cdPessoa,
                cd_usuario: user.user_sip,
            })
            .then(function (response) {
                setLoading(false);
                toast.success("Parecer inserido com sucesso");
                getListaParecerCandidato();
            })
            .catch(function (error) {
                setLoading(false);
                toast.error("Não foi possível inserir o parecer");
                console.error(error);
            });
    };

    useEffect(() => {
        setItensParecer(
            rawData.map((row) => {
                return {
                    cdItem: row.CD_HIST_PARECER_CANDIDATO,
                    title: row.CRIADO_POR,
                    subTitle: row.CRIADO_EM,
                    content: row.DS_OBSERVACOES,
                };
            })
        );
    }, [rawData]);

    useEffect(() => {
        if (cdPessoa) {
            getListaParecerCandidato();
        }
    }, [cdPessoa]);

    return (
        <div className={`col-span-12 relative min-h-[80vh]`}>
            <Loading active={loading} />
            <div className="max-h-[600px] overflow-y-auto mt-2">
                {itensParecer.length == 0 && (
                    <div className="flex justify-center">
                        <NoDataFound />
                    </div>
                )}
                {itensParecer.length > 0 && <Accordion items={itensParecer}></Accordion>}
            </div>
            <div className={"absolute bottom-[70px] right-[80px]"}>
                <Dialog
                    maxLength={3800}
                    textAreaLabel={" "}
                    btnAccept={"SALVAR"}
                    btnCancel={"CANCELAR"}
                    textAreaMinLength={50}
                    showDialog={showDialog}
                    setDialogControl={setShowDialog}
                    confirmActionCallback={(description) => {
                        inserirParecer(description);
                    }}
                    title={`Adicionar parecer`}
                />
                <FabAdd
                    onClick={() => {
                        setShowDialog(true);
                    }}
                    className="bottom-[80px] right-[20px]"
                />
            </div>
        </div>
    );
};

export default ParecerCandidato;
