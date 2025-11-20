import dynamic from 'next/dynamic'
import Loading from '@/components/Layouts/Loading'
const PieChart = dynamic(() => import('@/components/chart/PieChart'), {
	ssr: false,
})
import { empty } from '@/assets/utils'
import { useAppContext } from '@/context/AppContext'
import { useCallback, useEffect, useMemo, useState } from 'react'
import axiosInstance from '@/plugins/axios'
import InputDate from '@/components/inputs/InputDate'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import Button from '@/components/buttons/Button'
import moment from 'moment'
import { ready } from '@amcharts/amcharts5';

const GraficoMinhasVagasStatus = ({ cdUnidade, cdPessoaSelecionador }) => {
	const dateToday = moment().format('YYYY-MM-DD')
	const periodStart = moment().startOf("month").format("YYYY-MM-DD");
	const { toast } = useAppContext()
	const [isReady, setIsReady] = useState(false)
	const [dashboardDate, setDashboardDate] = useState({
		from: periodStart,
		until: dateToday,
	})
	const [dadosGrafico, setDadosGrafico] = useState([])

	const onChangeDashboardFromDate = (id, date) => {
		if (!date) return
		const selectedDate = moment(date, ['DD/MM/YYYY', 'YYYY-MM-DD']).format('YYYY-MM-DD')

		if (moment(selectedDate).isAfter(dateToday)) {
			toast.error('Não é possível selecionar uma data futura!')
			return
		}

		if (moment(selectedDate).isAfter(dashboardDate.until)) {
			toast.error('A data de início não pode ser maior que a data final!')
			return
		}

		setDashboardDate(prev => ({ ...prev, from: selectedDate }))
	}

	const onChangeDashboardUntilDate = (id, date) => {
		if (!date) return
		const selectedDate = moment(date, ['DD/MM/YYYY', 'YYYY-MM-DD']).format('YYYY-MM-DD')

		if (moment(selectedDate).isAfter(dateToday)) {
			toast.error('Não é possível selecionar uma data futura!')
			return
		}

		if (moment(selectedDate).isBefore(dashboardDate.from)) {
			toast.error('A data final não pode ser menor que a data inicial!')
			return
		}

		setDashboardDate(prev => ({ ...prev, until: selectedDate }))
	}

	const getSelecionadorGraficoComEmpresa = async () => {
		const params = {
			cd_pessoa_selecionador: cdPessoaSelecionador,
			dt_inicio: dashboardDate.from,
			dt_fim: dashboardDate.until,
			cd_empresa: cdUnidade,
		}
		setIsReady(false)
		await axiosInstance.get('vaga/vagas-selecionador-grafico', {
			params,
		}).then((response) => {
			setDadosGrafico(response.data)
		}).catch((error) => {
			console.error('Erro ao buscar dados do Gráfico:', error)
			toast.error('Não foi possível buscar dados das Vagas')
		}).finally(() => {
			setIsReady(true)
		})
	}

	const handleGenerateChart = () => {
		const dtStart = moment(dashboardDate.from, 'YYYY-MM-DD')
		const dtEnd = moment(dashboardDate.until, 'YYYY-MM-DD')

		if (!dtStart.isValid() || !dtEnd.isValid()) {
			toast.error('Período inválido')
			return
		}

		if (dtStart.isAfter(dtEnd)) {
			toast.error('Data de início não pode ser maior que a data final')
			return
		}

		getSelecionadorGraficoComEmpresa()
	}


	useEffect(() => {
		if (empty(cdUnidade)) return;
		getSelecionadorGraficoComEmpresa();
	}, [cdUnidade, cdPessoaSelecionador])

	const chartData = useMemo(
		() =>
			!empty(dadosGrafico)
				? [
						{ label: 'Abertas', value: dadosGrafico?.TOTAL_ABERTAS },
						{ label: 'Cliente', value: dadosGrafico?.TOTAL_SUSP },
						{ label: 'Comercial', value: dadosGrafico?.TOTAL_COMERCIAL },
						{ label: 'Fechadas', value: dadosGrafico?.TOTAL_FECHADAS },
						{ label: 'Canceladas Fat.', value: dadosGrafico?.TOTAL_CANC_FAT },
						{ label: 'Canceladas', value: dadosGrafico?.TOTAL_CANC },
						{ label: 'Bloqueadas', value: dadosGrafico?.TOTAL_BLOQUEADAS },
				  ]
				: [],
		[dadosGrafico]
	)

	return (
		<>
			<div className='flex flex-row gap-1 items-center'>
				<div className='w-6/12 h-fit'>
					<InputDate
						id='leftDashboardDate'
						label='Início'
						hint='Não afeta vagas ABERTAS'
						value={dashboardDate.from}
						max={dateToday}
						onBlur={onChangeDashboardFromDate}
						onChange={onChangeDashboardFromDate}
					/>
				</div>
				<div className='w-6/12 h-fit'>
					<InputDate
						id='rightDashboardDate'
						label='Fim'
						hint='Não afeta vagas ABERTAS'
						value={dashboardDate.until}
						max={dateToday}
						onBlur={onChangeDashboardUntilDate}
						onChange={onChangeDashboardUntilDate}
					/>
				</div>
				<div className='w-1/12 h-full flex items-end mb-2'>
					<Button
						id='btnGenerateChart'
						buttonType='primary'
						className='shadow'
						onClick={handleGenerateChart}
						size='small'
					>
						<FontAwesomeIcon icon={faSearch} width='16' height='16' className='m-0.5' />
					</Button>
				</div>
			</div>
			{!isReady ? (
				<Loading active={true} className='mt-8 relative' />
			) : !empty(dadosGrafico) ? (
				<PieChart chartData={chartData} nmChart='minhasvagasstatus' />
			) : (
				<div className='text-center text-xl p-3 font-semibold min-h-64'>
					<h1 className='mt-[80px]'>Nenhuma vaga encontrada para o período selecionado!</h1>
				</div>
			)}
		</>
	)
}

export default GraficoMinhasVagasStatus
