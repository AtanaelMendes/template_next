import Select2VagaAnalista from "@/components/inputs/Select2VagaAnalista";
import Title, { Subtitle } from "@/components/Layouts/Typography";
import Blockquote from "@/components/Layouts/Blockquote";
import { useAppContext } from "@/context/AppContext";
import Button from "@/components/buttons/Button";
import axiosInstance from "@/plugins/axios";
import { cn } from "@/assets/utils";
import { useState } from "react";

const RelacionarCandidato = ({
    id,
    active,
    handleClose,
    onSaveCallback,
    cdPessoaCandidato,
    nmPessoaCandidato,
    nrVagaAutoatendimento
}) => {
    const [nrVagaRelaciona, setNrVagaRelaciona] = useState(0);
    const { toast } = useAppContext();

    const relacionaCandiato = () => {
        axiosInstance.post(`recrutamento/relacionar-candidato`, {
            nr_vaga: nrVagaRelaciona,
            nr_vaga_autoatendimento: nrVagaAutoatendimento,
            cd_pessoa_candidato: cdPessoaCandidato,
            cd_estagio_vaga: 3,
            recrutamento: 1
        }).then((response) => {
            setNrVagaRelaciona(0);
            toast.success("Relacionado com sucesso!");
            
            if (typeof onSaveCallback == 'function') {
                onSaveCallback();
            }
        }).catch((error) => {
            if (error?.text) {
                return toast.error(error?.text);
            }
            return toast.error("Erro ao relacionar candidato");
        });
    }

    const onCloseAction = () => {
        setNrVagaRelaciona(0);

        if (typeof handleClose == 'function') {
            handleClose();
        }
    };

    return (
        <div
            className={cn(`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40`, active ? "" : "hidden")}
        >
            <div
                onClick={(e) => { e.stopPropagation(); }}
                className={cn(
                    "relative rounded-lg flex flex-col max-h-screen bg-white",
                    "h-full md:h-1/2 lg:h-3/6",
                    "w-full md:w-1/2 lg:w-3/6"
                )}
            >
                <div className="bg-primary text-white rounded-t-lg p-2">
                    <Title>Relacionar candidato</Title>
                </div>
                <div id={id} className={`col-span-12 px-4 py-2`}>
                    <div>
                        <Subtitle className={"font-semibold"}>{`${cdPessoaCandidato} - ${nmPessoaCandidato}`}</Subtitle>
                    </div>

                    <div>
                        <Select2VagaAnalista
                            value={nrVagaRelaciona}
                            id={`nr_vaga_relacionar`}
                            label="Relaciona a Vaga"
                            onChange={(value) => setNrVagaRelaciona(parseInt(value))}
                        />
                    </div>

                    <div className="mt-8">
                        <Blockquote type="default" size={"xs"}>
                            <div className="flex">
                                <span>Dica: Pesquise vagas pelo número da vaga, pelo código do analista ou pelo nome do analista.</span>
                            </div>
                        </Blockquote>
                    </div>
                </div>
                <div>
                    <div
                        className={cn(
                            "absolute p-2 h-[46px] border-t border-slate-300 bg-white w-full bottom-0 rounded-b-lg text-right",
                        )}
                    >
                        <Button buttonType="danger" outline onClick={() => { onCloseAction() }} size="small" className={"mr-4"}>
                            CANCELAR
                        </Button>
                        <Button buttonType="success" onClick={relacionaCandiato} size="small" disabled={nrVagaRelaciona == 0}>
                            SALVAR
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default RelacionarCandidato;
