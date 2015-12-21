
Imports System.Collections.Generic
Imports System.Linq
Imports System.Text
Imports System.Threading.Tasks
Imports System.Windows
Imports System.Windows.Controls
Imports System.Windows.Data
Imports System.Windows.Documents
Imports System.Windows.Input
Imports System.Windows.Media
Imports System.Windows.Media.Imaging
Imports System.Windows.Navigation
Imports System.Windows.Shapes
'#region "Namespace"
Imports C1.BarCode
'#endregion

Namespace BarCodeApp_VB

    Partial Public Class MainWindow
        Inherits Window
        Public Sub New()
            InitializeComponent()
            '#region "SubscribeEvents"
            AddHandler Me.Loaded, AddressOf MainWindow_Loaded
            AddHandler cbCodeType.SelectionChanged, AddressOf cbCodeType_SelectionChanged
            AddHandler text.TextChanged, AddressOf text_TextChanged
            '#endregion
        End Sub

        '#region "TextChangeEvent"
        Private Sub text_TextChanged(sender As Object, e As TextChangedEventArgs)
            If Not String.IsNullOrEmpty(Text.Text) AndAlso Text.Text.Equals("http://www.componentone.com") AndAlso barcode.CodeType = CodeType.QRCode Then
                Image.Opacity = 1
            Else
                Image.Opacity = 0
            End If
        End Sub
        '#endregion

        '#region "ComboBoxSelectionChangeEvent"
        Private Sub cbCodeType_SelectionChanged(sender As Object, e As SelectionChangedEventArgs)
            If barcode IsNot Nothing Then
                Try
                    barcode.CodeType = DirectCast(cbCodeType.SelectedItem, CodeType)
                    If barcode.CodeType <> CodeType.QRCode OrElse Not Text.Text.Equals("http://www.componentone.com") Then
                        Image.Opacity = 1
                    Else
                        Image.Opacity = 0
                    End If
                Catch ex As Exception
                    MessageBox.Show(ex.Message)
                End Try
            End If
        End Sub
        '#endregion

        '#region "MainWindowLoadEvent"
        Private Sub MainWindow_Loaded(sender As Object, e As RoutedEventArgs)
            cbCodeType.ItemsSource = [Enum].GetValues(GetType(CodeType))
            cbCodeType.SelectedItem = barcode.CodeType
        End Sub
        '#endregion
    End Class

End Namespace



