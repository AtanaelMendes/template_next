import axiosInstance from '@/plugins/axios';
import { empty } from "@/assets/utils";
import { useEffect, useState, useMemo } from 'react';
import NoDataFound from "@/components/Layouts/NoDataFound";
import Clipboard from '@/components/Layouts/Clipboard'
import { useAppContext } from "@/context/AppContext";

const CandidatosDescartadosPesquisa = ({nrVaga, nrSelecao, tabName }) =>{
    const [candidatosDescartados, setCandidatosDescartados] = useState([]);
    const [ready, setReady] = useState(false);
    const { toast, openPageTab, setLastTab} = useAppContext();

    const editarDadosCandidato = (cdPessoaCandidato) => {
        setLastTab(tabName);
        openPageTab({
            id: "DadosCandidato",
            name: "Dados do candidato",
            props: {
                cdPessoaCandidato: cdPessoaCandidato,
                nm_tab: tabName,
            },
        });
    };

    useEffect(() => {
        if (!nrSelecao) return;
        setReady(false);
        axiosInstance.get(`pesquisa-candidatos/candidatos/descartados/${nrVaga}/${nrSelecao}`
        ).then((response) => {
            if (response.status === 200) {
                setCandidatosDescartados(response.data)
            }
        }).catch((resp) => {
            let error = resp?.response?.data?.error;
            if (Array.isArray(error)) {
                return toast.error(error.join(" ") || "OOps ocorreu um erro ao buscar candidatos descartados.");
            }
            return toast.error(error || "OOps ocorreu um erro ao buscar candidatos descartados.");
        }).finally(() => {
            setReady(true);
        });
    }, [nrVaga, nrSelecao]);

    const dataToHtml = useMemo(() => {
        if (empty(candidatosDescartados)){
            return (
                <NoDataFound isLoading={!ready}/>
            );
        }
        return candidatosDescartados.map((cand, index) => {
            return (
                <div className="flex flex-row flex-nowrap justify-between odd:bg-white even:bg-gray-100 col-span-12" key={`row_${index}`}>
                    <div>
                        <div className="flex flex-row flex-nowrap items-center">
                            <div className="flex-nowrap p-2 text-xs text-slate-500">
                                Candidato:
                            </div>
                            <div className="flex-nowrap pr-2 text-sm font-semibold text-primary hover:underline cursor-pointer" onClick={() => {editarDadosCandidato(cand.CD_PESSOA_CANDIDATO)}}>
                                {cand.NM_PESSOA}
                            </div>
                            <div className="flex-nowrap pr-2 text-xs text-slate-500">
                                -
                            </div>
                            <div className="flex-nowrap pr-2">
                                <Clipboard className={'font-semibold text-sm'}>
                                    {cand.CD_PESSOA_CANDIDATO}
                                </Clipboard>
                                
                            </div>
                        </div>

                        <div className="flex flex-row flex-nowrap items-center">
                            
                        </div>
                        <div className="flex flex-row flex-nowrap items-center">
                            <div className="flex-nowrap p-2 text-xs text-slate-500">
                                Localidade:
                            </div>
                            <div className="flex-nowrap pr-2 text-sm">
                                {cand.DS_LOCALIDADE_SEM_CEP}
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-row flex-nowrap items-center">
                        <div className="flex-nowrap pl-10 pr-2 text-xs text-slate-500">
                            Última atualização:
                        </div>
                        <div className="flex-nowrap pr-2 text-sm">
                            {cand.ALTERADO_EM}
                        </div>
                    </div>
                </div> 
            )
        })
    }, [candidatosDescartados, ready]);

    return dataToHtml;
};
export default CandidatosDescartadosPesquisa