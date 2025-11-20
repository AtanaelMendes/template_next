import dynamic from 'next/dynamic'
const MinhasVagasEmAberto = dynamic(
	() => import('@/components/selecao/entrar/graficos/MinhasVagasEmAberto'),
	{ ssr: false }
)
const MinhasVagasStatus = dynamic(
	() => import('@/components/selecao/entrar/graficos/MinhasVagasStatus'),
	{ ssr: false }
)
import { DebouncedSearch } from '@/components/inputs/DebouncedSearch';
import Card, { CardBody, CardTitle } from '@/components/cards/Card';
import { useAppContext } from '@/context/AppContext';
import { useEffect, useState } from 'react';
import { empty } from '@/assets/utils';

function Dashboard({init, active, reload }) {
	const { user, setDashboardData, dashboardData } = useAppContext();

	useEffect(() => {
		let cd_unidade = user.cd_unid;

		// fiz essa merda pq to cansado de ter que ficar selecionando joinville
		if (cd_unidade == "430") {
			cd_unidade = "1";
		}
		setDashboardData(prevState => ({...prevState, cd_pessoa_selecionador: user.cd_sip, cd_unidade: cd_unidade}));
	}, []);

	const handleOnChangeAnalista = value => {
		if (value == dashboardData.cd_pessoa_selecionador) return;
		setDashboardData(prevState => ({...prevState, cd_pessoa_selecionador: value}));
	}

	const handleOnChangeUnidade = value => {
		if (value == dashboardData.cd_unidade) return;
		setDashboardData(prevState => ({...prevState, cd_pessoa_selecionador: null, cd_unidade: value}));
	}

	if (!init) return null;

	return (
		<div className={`flex flex-col gap-4 p-4 ${!active ? "hidden" : ""}`}>
			<div className='flex flex-row gap-4 w-full'>
				<div className='flex flex-col w-1/2 xl:w-3/12'>
					<DebouncedSearch.Root>
						<DebouncedSearch.Label label={'Unidade'} />
						<DebouncedSearch.Select
							ready={!empty(user.cd_sip)}
							onChange={value => {
								handleOnChangeUnidade(value)
							}}
							value={dashboardData.cd_unidade}
							urlGet={`vaga/unidades-selecionador-grafico/${user.cd_sip}`}
							optId={'CD_EMPRESA'}
							optLabel={'NM_EMPRESA'}
							helperText='Selecione a unidade para mostrar os analistas'
						/>
					</DebouncedSearch.Root>
				</div>
				<div className='flex flex-col w-1/2 xl:w-4/12'>
					<DebouncedSearch.Root>
						<DebouncedSearch.Label label={'Analista'} />
						<DebouncedSearch.Select
							ready={!empty(dashboardData.cd_pessoa_selecionador) && !empty(dashboardData.cd_unidade)}
							isClearable={true}
							onChange={value => {
								handleOnChangeAnalista(value)
							}}
							value={dashboardData.cd_pessoa_selecionador}
							urlGet={`analista/lista-analistas/${user.cd_sip}/unidade/${dashboardData.cd_unidade}`}
							optId={'CD_PESSOA'}
							optLabel={'NM_USUARIO'}
							helperText='Selecione o analista para todos os gráficos'
						/>
					</DebouncedSearch.Root>
				</div>
			</div>
			<div className={`grid grid-cols-12 gap-4 rounded`}>
				<div className='col-span-12 md:col-span-6'>
					{!reload && <Card className={'h-full'}>
						<CardTitle>Vagas em aberto</CardTitle>
						<CardBody>
							<MinhasVagasEmAberto
								cdUnidade={dashboardData.cd_unidade}
                                cdPessoaSelecionador={dashboardData.cd_pessoa_selecionador}
							/>
						</CardBody>
					</Card>}
				</div>

				<div className='col-span-12 md:col-span-6'>
					{!reload && <Card>
						<CardTitle>Status das minhas vagas</CardTitle>
						<CardBody>
							<MinhasVagasStatus
                                cdUnidade={dashboardData.cd_unidade}
                                cdPessoaSelecionador={dashboardData.cd_pessoa_selecionador}
                            />
						</CardBody>
					</Card>}
				</div>
			</div>
		</div>
	)
}
export default Dashboard